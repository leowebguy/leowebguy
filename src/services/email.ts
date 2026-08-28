import { ContactFormData, EmailResponse } from '../types';

/**
 * Heuristic check to detect dot-stuffed Gmail variations (e.g. t.ap.af.ag.uf.iki.5.2@gmail.com).
 * Gmail ignores dots in the local part, so spammers often generate emails with 4 or more dots in the username.
 */
export function isDotStuffedGmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const parts = normalized.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') return false;

  const dotCount = (localPart.match(/\./g) || []).length;
  return dotCount >= 4;
}

/**
 * Heuristic check for high-entropy / random-looking string patterns in names (e.g. xIIodPSxdQiXLDKSK).
 * Calculates Shannon entropy of alpha characters or detects long unusual mixed-case/consonant sequences.
 */
export function isHighEntropyName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 8) return false;

  // Count letters and calculate entropy on clean alphabetic characters
  const alphasOnly = trimmed.replace(/[^a-zA-Z]/g, '');
  if (alphasOnly.length < 8) return false;

  const charFrequencies: Record<string, number> = {};
  for (const char of alphasOnly) {
    charFrequencies[char] = (charFrequencies[char] || 0) + 1;
  }

  let entropy = 0;
  const len = alphasOnly.length;
  for (const count of Object.values(charFrequencies)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  // High entropy threshold for random character strings
  const maxConsecutiveConsonants = (alphasOnly.match(/[^aeiouAEIOU]{6,}/g) || []).length > 0;

  return entropy > 3.65 || maxConsecutiveConsonants;
}

/**
 * Combined anti-spam check for form submissions
 */
export function isSpamSubmission(data: ContactFormData): { isSpam: boolean; reason?: string } {
  // 1. Honeypot Trap check
  if (data.website_url && data.website_url.trim() !== '') {
    return { isSpam: true, reason: 'Honeypot field filled' };
  }

  // 2. Dot-stuffed Gmail pattern
  if (isDotStuffedGmail(data.email)) {
    return { isSpam: true, reason: 'Dot-stuffed Gmail pattern detected' };
  }

  // 3. High-entropy random name check
  if (isHighEntropyName(data.name)) {
    return { isSpam: true, reason: 'High-entropy name pattern detected' };
  }

  return { isSpam: false };
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendEmail(data: ContactFormData): Promise<EmailResponse> {
  // Anti-spam multi-layer protection check
  const spamResult = isSpamSubmission(data);
  if (spamResult.isSpam) {
    console.warn(`[Anti-Spam Filter] Submission dropped silently: ${spamResult.reason}`);
    // Silently drop without error to keep spammers unaware, returning a fake success response
    return { success: true, message: 'Thanks for your message! I\'ll reach out as soon as possible' };
  }

  const apiUrl = import.meta.env.VITE_EMAIL_API_URL;
  const apiKey = import.meta.env.VITE_EMAIL_API_KEY;
  const toEmail = import.meta.env.VITE_EMAIL_TO;

  if (!apiUrl || !apiKey) {
    // Return mock success if environment variables are not configured in dev
    console.log('[Email Service Demo] Contact submission received:', data);
    return { success: true, message: 'Thanks for your message! I\'ll reach out as soon as possible' };
  }

  try {
    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fb; padding: 30px 20px; color: #111; max-width: 600px; margin: 0 auto; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px; border-radius: 6px 6px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Novo Formulário de Contato</h2>
          <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 14px;">leowebguy portfolio</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 6px 6px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%; font-size: 14px; color: #64748b;">Nome:</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #111;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 14px; color: #64748b;">E-mail:</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #111;"><a href="mailto:${escapeHtml(data.email)}" style="color: #10b981; text-decoration: none; font-weight: 500;">${escapeHtml(data.email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 14px; color: #64748b;">Telefone:</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #111;">${escapeHtml(data.phone || 'Não informado')}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 20px; background-color: #f8fafc; border-left: 4px solid #10b981; border-radius: 0 4px 4px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Mensagem:</h4>
            <p style="white-space: pre-wrap; margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">${escapeHtml(data.msg)}</p>
          </div>
          
          <p style="margin-top: 30px; margin-bottom: 0; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Esta mensagem foi enviada diretamente do formulário de contato do leowebguy. Responda a este e-mail para falar com o cliente.
          </p>
        </div>
      </div>
    `;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        to: toEmail,
        subject: `leowebguy | contact - ${data.name}`,
        replyTo: data.email,
        reply_to: data.email,
        recaptchaToken: data.recaptchaToken,
        __recaptcha_token: data.recaptchaToken,
        __header_x_api_key: apiKey,
        html,
      }),
    });

    if (response.ok) {
      return { success: true, message: 'Thanks for your message! I\'ll reach out as soon as possible' };
    }
    return { success: false, message: 'Failed to send message. Please try again.' };
  } catch (error: any) {
    console.error('Email API Error:', error);
    return { success: false, message: error?.message || 'Error connecting to email server.' };
  }
}
