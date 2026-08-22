# AI Agent Guidelines & Repository Overview

This document outlines the technical architecture, project organization, environment configurations, and operational rules for AI agents working on the `leowebguy` project.

---

## 1. Tech Stack

- **Core Framework**: [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Dev Server**: [Vite](https://vitejs.dev/) (v8)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) (v3), PostCSS, Autoprefixer, Sass
- **Icons & UI**: [Lucide React](https://lucide.dev/) icon library
- **Security & Validation**: `react-google-recaptcha-v3` for reCAPTCHA integration
- **Email Service**: External Resend Mailer API endpoint via custom service integration
- **Agent Lifecycle & Telemetry**: Node.js lifecycle hook runner (`.agents/hooks.json`), `.agents/telemetry.js` syncing agent transcript & SQLite metrics to a telemetry server.

---

## 2. Code Organization

```
leowebguy/
├── .agents/                    # Agent customizations, skills, and hooks
│   ├── hooks.json              # Agent lifecycle hook definitions (e.g. Stop event)
│   ├── telemetry.js            # Telemetry logger script sending session metrics
│   └── skills/                 # Repository skills (email-service, frontend-design, react)
├── public/                     # Static assets (SVG icons, favicons)
├── src/
│   ├── main.tsx                # App entry point with ReCaptchaProvider wrapper
│   ├── App.tsx                 # Core portfolio landing page component
│   ├── index.css               # Global styles, Tailwind directives, and CSS variables
│   ├── types.ts                # Shared TypeScript interfaces & types
│   ├── components/             # Reusable UI components
│   │   ├── ContactModal.tsx    # Interactive contact modal with reCAPTCHA & email trigger
│   │   ├── TechStack.tsx       # Interactive technology skills grid
│   │   └── Icons.tsx           # Custom SVG icon wrappers
│   └── services/               # External API services
│       └── email.ts            # Resend Mailer API integration & email dispatching
├── docs/                       # Project documentation & development logs
├── scripts/                    # Build and utility scripts
├── .env                        # Local environment variables (DO NOT COMMIT)
├── .env.example                # Template for environment configuration
├── package.json                # NPM dependencies & scripts
├── tailwind.config.cjs         # Tailwind CSS design system configuration
└── vite.config.js              # Vite bundler configuration
```

---

## 3. Rules for AI Agents

1. **Empirical Verification**:
   - Always verify changes by running `npm run build` or dev server checks before concluding tasks. Never assume a code edit is functional without checking for build or syntax errors.

2. **Telemetry & Hook Maintenance**:
   - Maintain the integrity of `.agents/hooks.json` and `.agents/telemetry.js`.
   - Ensure hook commands use valid relative paths (e.g., `node .agents/telemetry.js`).
   - Do not remove or disable telemetry hooks unless explicitly instructed by the user.

3. **Type Safety & Code Consistency**:
   - Strictly follow TypeScript typings in `src/types.ts`. Avoid using `any` or disabling type checks with `@ts-ignore` unless strictly necessary.
   - Keep UI components inside `src/components/` and business logic / API integration inside `src/services/`.

4. **Environment & Security**:
   - Never commit sensitive keys or credentials to Git.
   - When introducing new environment variables, update `.env.example` with placeholder descriptions.
   - Ensure local dev endpoints (e.g. `TELEMETRY_ENDPOINT`) use the correct HTTP/HTTPS protocol scheme.

5. **Design & Aesthetics**:
   - Maintain responsive design standards across all breakpoints.
   - Use Tailwind utility classes complemented by design tokens in `index.css`.

---

## 4. Environment Parameters

The application uses environment variables loaded at build time via Vite (`VITE_` prefix) and runtime env variables for local agent telemetry.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `VITE_EMAIL_API_URL` | String (URL) | Yes | Resend Mailer API endpoint for sending contact form messages |
| `VITE_EMAIL_API_KEY` | String | Yes | Authorization key for the email service endpoint |
| `VITE_EMAIL_TO` | String (Email) | Yes | Destination recipient email address for contact submissions |
| `VITE_RECAPTCHA_KEY` | String | Yes | Public site key for Google reCAPTCHA v2 / v3 validation |
| `TELEMETRY_HASH` | String | No | Bearer token for agent telemetry API authentication |
| `TELEMETRY_ENV` | String | No | Deployment environment label (e.g., `local`, `production`) |
| `TELEMETRY_USER` | String | No | Developer/Agent username label for telemetry logging |
| `TELEMETRY_APP` | String | No | Project application identifier (default: `leowebguy`) |
| `TELEMETRY_ENDPOINT` | String (URL) | No | Target API endpoint for logging agent session telemetry metrics |

---
