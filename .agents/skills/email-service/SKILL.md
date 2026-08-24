---
name: email-service
description: Implementation guide and usage documentation for the Email Service, covering environment variables VITE_EMAIL_API_URL, VITE_EMAIL_API_KEY, and VITE_EMAIL_TO.
---

# Email Service — Integration and Usage Guide

This Skill provides documentation on how the email service `src/services/email.ts` operates within the project.

The service connects to an email dispatch microservice hosted on DigitalOcean Functions using the Resend API.

---

## 🔑 Environment Variables

The service uses the following Vite environment variables (prefixed with `VITE_`) for its configuration. If not defined, the service falls back to default values:

### 1. `VITE_EMAIL_API_URL`
* **Description:** The endpoint URL of the HTTP microservice responsible for dispatching emails.
* **Default Value (Fallback):** `https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-86527741-6118-4953-a5b7-46c827b1a71a/email/send`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_URL=https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-86527741-6118-4953-a5b7-46c827b1a71a/email/send
  ```

### 2. `VITE_EMAIL_API_KEY`
* **Description:** The secret API key required for authentication with the microservice. It is sent both in the `X-API-Key` header and in the request payload.
* **Default Value (Fallback):** `935f2c4b-540a-4a70-a3e7-248e898078f7`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_KEY=your-api-token-here
  ```

### 3. `VITE_EMAIL_TO`
* **Description:** The administrative email address that receives notifications for new contact form submissions.
* **Default Value (Fallback):** `leowebguy@gmail.com`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_TO=leowebguy@gmail.com
  ```

---

## 🔒 reCAPTCHA & Email Fetch Usage Instructions

When submitting emails from the website form, acquire a reCAPTCHA token using `react-google-recaptcha-v3` (`useGoogleReCaptcha()`) and pass `recaptchaToken` to the send email function:

```typescript
// Using react-google-recaptcha-v3 hook in components:
const { executeRecaptcha } = useGoogleReCaptcha();
const recaptchaToken = executeRecaptcha ? await executeRecaptcha('submit') : undefined;

await sendContactEmail({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-123-4567',
  msg: 'Hello, I need assistance with a project.',
  recaptchaToken
});
```

---

## 🛠️ Exported Functions

### 1. `sendEmail(params: EmailParams): Promise<EmailResponse>`
Low-level function for sending generic emails.

```typescript
import { sendEmail } from '@/services/email';

await sendEmail({
  to: 'recipient@email.com',
  subject: 'Email Subject',
  html: '<p>HTML Content</p>',
  replyTo: 'contact@example.com',
  recaptchaToken: 'token' // Optional
});
```

### 2. `sendContactEmail(contactData): Promise<EmailResponse>`
High-level function for sending contact form submissions directly to `VITE_EMAIL_TO` (`leowebguy@gmail.com`) with styled HTML output.

```typescript
import { sendContactEmail } from '@/services/email';

await sendContactEmail({
  name: 'Sender Name',
  email: 'sender@email.com',
  phone: '123-456-7890',
  msg: 'Message content',
  recaptchaToken: 'token'
});
```

* **Parameter Interfaces (`src/types.ts`):**
  ```typescript
  export interface EmailParams {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    recaptchaToken?: string;
  }

  export interface EmailResponse {
    success: boolean;
    data?: any;
    error?: string;
  }
  ```

---

## 📧 Email Layout and Templates

The generated contact email template uses clean inline styling:
- **Heading:** Novo Formulário de Contato (`#333`)
- **Container / Message Box:** Background `#f9f9f9`, border left `#28a745`
- **Typography:** Arial, sans-serif, `1.6` line-height

