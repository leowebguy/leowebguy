export interface Technology {
  name: string;
  icon?: string;
  isDivider?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  msg: string;
}

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  reply_to?: string;
  recaptchaToken?: string;
}

export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: string;
}
