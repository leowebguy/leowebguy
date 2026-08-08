import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { ContactFormData } from '../types';
import { sendContactEmail } from '../services/email';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_KEY || '';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    msg: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setCaptchaError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setCaptchaError(true);
      return;
    }

    setStatus('submitting');

    const result = await sendContactEmail(formState);

    if (result.success) {
      setFormState({ name: '', email: '', phone: '', msg: '' });
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <form name="contact" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <h4 className="text-lg font-semibold text-slate-100">Reach out</h4>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <fieldset disabled={status === 'submitting'} className="space-y-4">
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Name (required)"
                maxLength={60}
                autoComplete="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Email (required)"
                autoComplete="email"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Phone"
                autoComplete="tel"
                value={formState.phone}
                onChange={handleInputChange}
              />
              <textarea
                name="msg"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                rows={5}
                placeholder="Your message here (required)"
                maxLength={255}
                value={formState.msg}
                onChange={handleInputChange}
                required
              ></textarea>

              {RECAPTCHA_SITE_KEY && (
                <div className="flex flex-col items-center justify-center pt-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    theme="dark"
                    onChange={handleCaptchaChange}
                  />
                  {captchaError && (
                    <p className="text-rose-400 text-xs mt-2">
                      Please complete the reCAPTCHA verification.
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-row items-center justify-end gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting' || (Boolean(RECAPTCHA_SITE_KEY) && !captchaToken)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send'}
                </button>
              </div>
            </fieldset>

            {status === 'success' && (
              <div className="p-4 mt-4 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-emerald-200 text-sm">
                Thanks for your message!<br />I'll reach out as soon as possible
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 mt-4 bg-amber-950/60 border border-amber-700/60 rounded-lg text-amber-200 text-sm">
                Sorry, something went wrong. Please send an email to leowebguy@gmail.com
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

