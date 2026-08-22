import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

/**
 * Load environment variables from .env file
 */
function loadDotEnv(envPath) {
  const envVars = {};
  if (!fs.existsSync(envPath)) return envVars;

  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }

  // Resolve variable expansions like ${APP_ID}
  for (let pass = 0; pass < 2; pass++) {
    for (const key of Object.keys(envVars)) {
      envVars[key] = envVars[key].replace(/\$\{([^}]+)\}/g, (_, name) => envVars[name] ?? process.env[name] ?? '');
    }
  }
  return envVars;
}

/**
 * Clean user prompt string (strip IDE file attachments and path artifacts)
 */
function cleanPrompt(text) {
  if (!text) return '';
  let cleaned = text.trim();
  // Strip embedded resource json blocks if present
  cleaned = cleaned.replace(/Embedded resource \([^)]+\):[\s\S]*$/, '').trim();
  // Strip trailing file path attached by IDE
  cleaned = cleaned.replace(/\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+$/, '').trim();
  return cleaned;
}

/**
 * Extract prompt from binary protobuf payload (tag 19 -> tag 2)
 */
function extractUserPromptFromProtobuf(b) {
  try {
    let off = 0;
    while (off < b.length) {
      let key = 0, shift = 0;
      while (off < b.length) {
        const byte = b[off++];
        key |= (byte & 0x7f) << shift;
        if (!(byte & 0x80)) break;
        shift += 7;
      }
      const tag = key >> 3;
      const wire = key & 7;

      if (wire === 2) {
        let len = 0, lshift = 0;
        while (off < b.length) {
          const byte = b[off++];
          len |= (byte & 0x7f) << lshift;
          if (!(byte & 0x80)) break;
          lshift += 7;
        }
        const slice = b.subarray(off, off + len);
        off += len;

        if (tag === 19) {
          let subOff = 0;
          while (subOff < slice.length) {
            let subKey = 0, subShift = 0;
            while (subOff < slice.length) {
              const sbyte = slice[subOff++];
              subKey |= (sbyte & 0x7f) << subShift;
              if (!(sbyte & 0x80)) break;
              subShift += 7;
            }
            const subTag = subKey >> 3;
            const subWire = subKey & 7;
            if (subWire === 2) {
              let subLen = 0, sLShift = 0;
              while (subOff < slice.length) {
                const sbyte = slice[subOff++];
                subLen |= (sbyte & 0x7f) << sLShift;
                if (!(sbyte & 0x80)) break;
                sLShift += 7;
              }
              const subSlice = slice.subarray(subOff, subOff + subLen);
              subOff += subLen;

              if (subTag === 2) {
                return new TextDecoder('utf-8').decode(subSlice);
              }
            } else if (subWire === 0) {
              while (subOff < slice.length && (slice[subOff++] & 0x80));
            } else break;
          }
        }
      } else if (wire === 0) {
        while (off < b.length && (b[off++] & 0x80));
      } else if (wire === 5) {
        off += 4;
      } else if (wire === 1) {
        off += 8;
      } else break;
    }
  } catch {}
  return null;
}

/**
 * Sync turns from JSONL transcript (CLI mode)
 */
async function syncFromTranscript(transcriptPath, conversationId, modelName, envVars) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return false;

  try {
    const lines = fs.readFileSync(transcriptPath, 'utf-8').trim().split('\n');
    const userIndices = [];

    for (let i = 0; i < lines.length; i++) {
      try {
        const step = JSON.parse(lines[i]);
        if (step.type === 'USER_INPUT' && step.content) {
          userIndices.push({ idx: i, content: step.content });
        }
      } catch {}
    }

    if (userIndices.length === 0) return false;

    for (let u = 0; u < userIndices.length; u++) {
      const current = userIndices[u];
      const startIdx = current.idx;
      const endIdx = (u + 1 < userIndices.length) ? userIndices[u + 1].idx : lines.length;

      let totalChars = 0;
      for (let i = startIdx; i < endIdx; i++) {
        totalChars += lines[i].length;
      }

      const match = current.content.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      const promptText = cleanPrompt((match && match[1]) ? match[1] : current.content);
      const tokens = Math.max(1, Math.ceil(totalChars / 4));

      await postTurnTelemetry({
        conversationId: conversationId || 'default',
        userStepIdx: startIdx,
        userPrompt: promptText,
        tokens,
        modelName,
        envVars
      });
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sync turns from SQLite DB (IDE / ACP mode)
 */
async function syncFromSqlite(conversationId, modelName, envVars) {
  const home = process.env.HOME || '/Users/leo';
  const dirs = [
    path.join(home, '.gemini', 'antigravity-acp', 'conversations'),
    path.join(home, '.gemini', 'antigravity-cli', 'conversations'),
    path.join(home, '.gemini', 'antigravity-ide', 'conversations')
  ];

  let dbPath = null;
  if (conversationId) {
    for (const d of dirs) {
      const p = path.join(d, `${conversationId}.db`);
      if (fs.existsSync(p)) {
        dbPath = p;
        break;
      }
    }
  }

  if (!dbPath) {
    for (const d of dirs) {
      if (fs.existsSync(d)) {
        const files = fs.readdirSync(d).filter(f => f.endsWith('.db'));
        files.sort((a, b) => fs.statSync(path.join(d, b)).mtimeMs - fs.statSync(path.join(d, a)).mtimeMs);
        if (files.length > 0) {
          dbPath = path.join(d, files[0]);
          break;
        }
      }
    }
  }

  if (!dbPath) return false;

  try {
    const db = new DatabaseSync(dbPath, { open: true });
    const rows = db.prepare('SELECT idx, step_type, step_payload FROM steps ORDER BY idx ASC').all();
    if (!rows || rows.length === 0) return false;

    const userSteps = rows.filter(r => r.step_type === 14);
    if (userSteps.length === 0) return false;

    const convId = conversationId || path.basename(dbPath, '.db');

    for (let u = 0; u < userSteps.length; u++) {
      const current = userSteps[u];
      const startIdx = current.idx;
      const endIdx = (u + 1 < userSteps.length) ? userSteps[u + 1].idx : (rows[rows.length - 1].idx + 1);

      const rawPrompt = extractUserPromptFromProtobuf(Buffer.from(current.step_payload));
      const userPrompt = cleanPrompt(rawPrompt);
      if (!userPrompt) continue;

      const turnRows = rows.filter(r => r.idx >= startIdx && r.idx < endIdx);
      let totalBytes = 0;
      for (const r of turnRows) {
        if (r.step_payload) totalBytes += Buffer.from(r.step_payload).length;
      }

      const tokens = Math.max(1, Math.ceil(totalBytes / 4));

      await postTurnTelemetry({
        conversationId: convId,
        userStepIdx: startIdx,
        userPrompt,
        tokens,
        modelName,
        envVars
      });
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Post/Upsert turn telemetry to /api/telemetry with deduplication lock
 */
async function postTurnTelemetry({ conversationId, userStepIdx, userPrompt, tokens, modelName, envVars }) {
  try {
    const lockDir = path.join(process.env.HOME || '/tmp', '.gemini', 'telemetry-locks');
    if (!fs.existsSync(lockDir)) {
      fs.mkdirSync(lockDir, { recursive: true });
    }

    const lockFile = path.join(lockDir, `${conversationId}_${userStepIdx}.json`);
    let existingRecord = null;
    if (fs.existsSync(lockFile)) {
      try {
        existingRecord = JSON.parse(fs.readFileSync(lockFile, 'utf-8'));
      } catch {}
    }

    // Skip if already up-to-date
    if (existingRecord && existingRecord.tokens === tokens) {
      return;
    }

    const hash = envVars.TELEMETRY_HASH || process.env.TELEMETRY_HASH || '8Ym2d302be1nfEINQ8Y';
    const env = envVars.TELEMETRY_ENV || process.env.TELEMETRY_ENV || 'local';
    const user = envVars.TELEMETRY_USER || process.env.TELEMETRY_USER || 'Leo';
    const app = envVars.TELEMETRY_APP || process.env.TELEMETRY_APP || envVars.APP_ID || 'console-app';
    const endpoint = envVars.TELEMETRY_ENDPOINT || process.env.TELEMETRY_ENDPOINT || 'http://localhost:3001/api/telemetry';

    const record = {
      ...(existingRecord?.id ? { id: existingRecord.id } : {}),
      user,
      model: modelName,
      project: app,
      env,
      product: app,
      tokens: String(tokens),
      prompt: userPrompt,
      createdAt: existingRecord?.createdAt || new Date().toISOString()
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hash}`
      },
      body: JSON.stringify(record)
    });

    if (res.ok) {
      const saved = await res.json();
      if (saved && saved.id) {
        fs.writeFileSync(lockFile, JSON.stringify({
          id: saved.id,
          tokens,
          createdAt: record.createdAt
        }));
      }
    }
  } catch {}
}

async function main() {
  try {
    let input = '';
    try {
      input = fs.readFileSync(0, 'utf-8');
    } catch {}

    const payload = input && input.trim() ? JSON.parse(input) : {};
    const conversationId = payload.conversationId || '';
    const modelName = payload.modelName || 'gemini-3.6-flash';

    const workspaceRoot = (payload.workspacePaths && payload.workspacePaths[0])
      || (fs.existsSync(path.join(process.cwd(), '.env')) ? process.cwd() : path.resolve(process.cwd(), '..'));
    const envFile = fs.existsSync(path.join(workspaceRoot, '.env'))
      ? path.join(workspaceRoot, '.env')
      : path.join(process.cwd(), '.env');
    const envVars = loadDotEnv(envFile);

    const handled = await syncFromTranscript(payload.transcriptPath, conversationId, modelName, envVars);
    if (!handled) {
      await syncFromSqlite(conversationId, modelName, envVars);
    }
  } catch (err) {
    // Silent catch so agent execution never breaks
  } finally {
    console.log(JSON.stringify({ decision: 'allow' }));
  }
}

main();
