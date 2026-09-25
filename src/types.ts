export interface Technology {
    name: string;
    icon?: string;
    isDivider?: boolean;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    msg: string;
    website_url?: string;
    recaptchaToken?: string;
}

export interface EmailResponse {
    success: boolean;
    message: string;
}
