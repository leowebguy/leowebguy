---
name: email-service
description: Implementation guide and usage documentation for the Email Service, covering environment variables VITE_EMAIL_API_URL, VITE_EMAIL_API_KEY, and VITE_EMAIL_TO.
---

# Email Service — Integration and Usage Guide

This Skill provides documentation on how the email service ([`email.ts`](file:///Users/leo/Github/perfectpavers/src/services/email.ts)) operates within the project.

The service connects to an email dispatch microservice hosted on DigitalOcean Functions using the Resend API.

---

## 🔑 Environment Variables

The service uses the following Vite environment variables (prefixed with `VITE_`) for its configuration. If not defined, the service falls back to default values:

### 1. `VITE_EMAIL_API_URL`
* **Description:** The endpoint URL of the HTTP microservice responsible for dispatching emails.
* **Default Value (Fallback):** `https://resend-mailer-app-i2w6i.ondigitalocean.app/email/send`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_URL=https://your-digitalocean-api-url/email/send
  ```

### 2. `VITE_EMAIL_API_KEY`
* **Description:** The secret API key required for authentication with the microservice. It is sent both in the `X-API-Key` header and in the request body as `__header_x_api_key`.
* **Default Value (Fallback):** `935f2c4b-540a-4a70-a3e7-248e898078f7`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_API_KEY=your-api-token-here
  ```

### 3. `VITE_EMAIL_TO`
* **Description:** The administrative email address that receives notifications for new estimate requests submitted on the site.
* **Default Value (Fallback):** `lemmleoncio@gmail.com`
* **Example `.env` Configuration:**
  ```env
  VITE_EMAIL_TO=admin@perfectpaversflorida.com
  ```

---

## 🔒 reCAPTCHA & Email Fetch Usage Instructions

When submitting emails from the website form, acquire a reCAPTCHA token using `react-google-recaptcha-v3` (`useGoogleReCaptcha()`) or `grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_KEY || '', { action: 'submit' })`, and pass `recaptchaToken` to the send email function:

```javascript
// Using react-google-recaptcha-v3 hook in components:
const { executeRecaptcha } = useGoogleReCaptcha();
const recaptchaToken = executeRecaptcha ? await executeRecaptcha('submit') : undefined;

// Or direct grecaptcha execution:
// const siteKey = import.meta.env.VITE_RECAPTCHA_KEY || '';
// const recaptchaToken = await grecaptcha.execute(siteKey, { action: 'submit' });

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
    recaptchaToken
  }),
});
```

---

## 🛠️ Exported Functions

### 1. `sendEmail`
Low-level function for sending generic emails.

```typescript
import { sendEmail } from '@/services/email';

await sendEmail({
  to: 'client@email.com',
  subject: 'Email Subject',
  html: '<p>HTML Content</p>',
  replyTo: 'contact@perfectpaversflorida.com' // Optional
});
```

* **Parameter Interface:**
  ```typescript
  export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }
  ```

---

### 2. `sendEstimateNotification`
Orchestrator function for estimate request workflows. When an estimate request is submitted, it notifies the administrator (`VITE_EMAIL_TO`) with detailed customer and project information. The `replyTo` field is set to the customer's email address for easy direct replies.

```typescript
import { sendEstimateNotification } from '@/services/email';

await sendEstimateNotification({
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(954) 555-0199',
  serviceType: 'Brick Paver Driveway',
  address: 'Fort Lauderdale, FL',
  notes: 'Interested in travertine driveway pavers.' // Optional
});
```

* **Data Interface:**
  ```typescript
  export interface EstimateFormData {
    fullName: string;
    email: string;
    phone: string;
    serviceType: string;
    address?: string;
    notes?: string;
  }
  ```

---

## 📧 Email Layout and Templates

The generated emails use inline styling aligned with the brand design guidelines ([`AGENTS.md`](file:///Users/leo/Github/perfectpavers/agents.md)):
- **Primary Header Gradient:** `#144377` to `#0d2c52`
- **Body Background:** `#f4f7fb`
- **Container Background:** `#ffffff`
- **Primary Text:** `#1e293b`
- **Typography:** Arial, Helvetica, and sans-serif fonts.
