---
name: email-service
description: Implementation guide and usage documentation for the Email Service, covering environment variables VITE_EMAIL_API_URL, VITE_EMAIL_API_KEY, and VITE_EMAIL_TO.
---

# Email Service — Integration and Usage Guide

This Skill provides documentation on how the email service `src/services/email.ts` operates within the project.

The service connects to an email dispatch microservice hosted on DigitalOcean Functions using the Resend API.

---

## 🔑 Environment Variables

The service uses the following Vite environment variables (prefixed with `VITE_`) for its configuration. These variables must be defined in your `.env` configuration file without default fallback values inside the code:

### 1. `VITE_EMAIL_API_URL`
* **Description:** The endpoint URL of the HTTP microservice responsible for dispatching emails.
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_URL=https://resend-mailer-app-i2w6i.ondigitalocean.app/email/send
  ```

### 2. `VITE_EMAIL_API_KEY`
* **Description:** The secret API key required for authentication with the microservice. It is sent both in the `X-API-Key` header and in the request body as `__header_x_api_key`.
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_KEY=your-api-token-here
  ```

### 3. `VITE_EMAIL_TO`
* **Description:** The administrative email address that receives notifications for new requests submitted on the site.
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_TO=lemmleoncio@gmail.com
  ```

---

## 🔒 reCAPTCHA & Email Fetch Usage Instructions

When submitting emails from the website form, acquire a reCAPTCHA token using `react-google-recaptcha-v3` (`useGoogleReCaptcha()`) and pass `recaptchaToken` to the send email function:

```javascript
// Using react-google-recaptcha-v3 hook in components:
const { executeRecaptcha } = useGoogleReCaptcha();
const recaptchaToken = executeRecaptcha ? await executeRecaptcha('contact_form') : undefined;

const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
  body: JSON.stringify({
    to,
    subject,
    html,
    replyTo,
    reply_to,
    recaptchaToken,
    __recaptcha_token: recaptchaToken,
    __header_x_api_key: API_KEY,
  }),
});
```

---

## 🛠️ Exported Functions & Heuristics

### 1. `sendEmail`
Main entrypoint for sending email notifications. Orchestrates form data validation, silent anti-spam filtering, and sends styled emails to the admin recipient (`VITE_EMAIL_TO`).

```typescript
import { sendEmail } from '@/services/email';

const result = await sendEmail({
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  phone: '(555) 019-9234',
  msg: 'I would like to inquire about your freelance availability.',
  recaptchaToken: 'recaptcha-token-here'
});
```

* **Data Interface (`ContactFormData` in `src/types.ts`):**
  ```typescript
  export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    msg: string;
    website_url?: string; // Honeypot field (must be hidden in UI)
    recaptchaToken?: string;
  }
  ```

---

### 2. Heuristic Anti-Spam Protections

To protect forms from automated bots and spammers, the email service evaluates submissions using the following heuristic functions before sending any requests:

#### `isDotStuffedGmail(email: string): boolean`
Detects gmail addresses containing 4 or more dots in their local username part (e.g. `t.ap.af.ag.uf.iki.5.2@gmail.com`). Spammers commonly abuse Gmail's ignore-dot routing behavior.

#### `isHighEntropyName(name: string): boolean`
Detects random name values (e.g. `xIIodPSxdQiXLDKSK`) using a Shannon Entropy calculation on alpha characters (threshold `> 3.65`) and consonant cluster checking (6+ consecutive consonants).

#### `isSpamSubmission(data: ContactFormData): { isSpam: boolean; reason?: string }`
Runs all checks in order:
1. **Honeypot Trap:** Checks if the hidden `website_url` input field contains any value.
2. **Dot-stuffed Gmail Pattern:** Evaluates the email using `isDotStuffedGmail`.
3. **High-Entropy Name:** Evaluates the name using `isHighEntropyName`.

If spam is detected, submissions are silently dropped with a warning logged in console, returning a mock success response so spammers remain unaware.

---

## 📧 Email Layout and Templates

The generated HTML emails use premium inline styling matching the brand design guidelines (`agents.md`):
- **Primary Header Gradient:** Slate-900 to Slate-800 (`linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`)
- **Body Background:** `#f4f7fb`
- **Container Background:** `#ffffff`
- **Primary Text:** `#111111`
- **Link Accent Color:** `#10b981` (Emerald-500)
- **Typography:** Arial, Helvetica, and sans-serif fonts.
