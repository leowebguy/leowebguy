import { EmailParams, EmailResponse } from '../types';

const API_URL = import.meta.env.VITE_EMAIL_API_URL || 'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-86527741-6118-4953-a5b7-46c827b1a71a/email/send';
const API_KEY = import.meta.env.VITE_EMAIL_API_KEY || '935f2c4b-540a-4a70-a3e7-248e898078f7';
const EMAIL_TO = import.meta.env.VITE_EMAIL_TO || 'leowebguy@gmail.com';

/**
 * Sends a generic email notification using the Email Service microservice.
 */
export async function sendEmail(params: EmailParams): Promise<EmailResponse> {
  try {
    const replyTo = params.replyTo || params.reply_to;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(replyTo ? {
          replyTo: replyTo,
          reply_to: replyTo,
          reply_to_email: replyTo,
        } : {}),
      }),
    });

    const data = await response.json();

    if (response.ok && data && data.success) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data?.error || `HTTP Error ${response.status}`,
    };
  } catch (err: any) {
    console.error('Email Service Error:', err);
    return {
      success: false,
      error: err.message || 'Erro ao enviar e-mail',
    };
  }
}

/**
 * Sends contact form submission email notification.
 */
export async function sendContactEmail(contactData: {
  name: string;
  email: string;
  phone?: string;
  msg: string;
  recaptchaToken?: string;
}): Promise<EmailResponse> {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #333;">Novo Formulário de Contato</h2>
      <p><strong>Nome:</strong> ${contactData.name}</p>
      <p><strong>E-mail:</strong> ${contactData.email}</p>
      <p><strong>Telefone:</strong> ${contactData.phone || 'Não informado'}</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin-top: 15px; border-radius: 4px;">
        <strong>Mensagem:</strong><br>
        ${contactData.msg.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  return sendEmail({
    to: EMAIL_TO,
    subject: 'leowebguy | contact',
    html,
    replyTo: contactData.email,
  });
}
