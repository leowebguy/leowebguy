import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isDotStuffedGmail, isHighEntropyName, isSpamSubmission, sendEmail } from './email';
import { ContactFormData } from '../types';

describe('Email Service Anti-Spam Heuristics', () => {
    describe('isDotStuffedGmail', () => {
        it('should return true for Gmail addresses with 4 or more dots in the local part', () => {
            expect(isDotStuffedGmail('t.ap.af.ag.uf.iki.5.2@gmail.com')).toBe(true);
            expect(isDotStuffedGmail('a.b.c.d.e@gmail.com')).toBe(true);
            expect(isDotStuffedGmail('a.b.c.d.e@googlemail.com')).toBe(true);
        });

        it('should return false for Gmail addresses with less than 4 dots in the local part', () => {
            expect(isDotStuffedGmail('john.doe@gmail.com')).toBe(false);
            expect(isDotStuffedGmail('a.b.c@gmail.com')).toBe(false);
        });

        it('should return false for non-Gmail domains even with 4 or more dots', () => {
            expect(isDotStuffedGmail('a.b.c.d.e@outlook.com')).toBe(false);
            expect(isDotStuffedGmail('a.b.c.d.e@yahoo.com')).toBe(false);
        });
    });

    describe('isHighEntropyName', () => {
        it('should return true for high-entropy / random-looking alphabetic names', () => {
            expect(isHighEntropyName('xIIodPSxdQiXLDKSK')).toBe(true);
        });

        it('should return true for names containing 6 or more consecutive consonants', () => {
            expect(isHighEntropyName('John rthplq Doe')).toBe(true); // "rthplq" has 6 consonants
        });

        it('should return false for normal names', () => {
            expect(isHighEntropyName('John Doe')).toBe(false);
            expect(isHighEntropyName('Leo Leoncio')).toBe(false);
            expect(isHighEntropyName('Anna Smith')).toBe(false);
        });

        it('should return false for very short names (< 8 characters)', () => {
            expect(isHighEntropyName('ab')).toBe(false);
            expect(isHighEntropyName('xyz')).toBe(false);
        });
    });

    describe('isSpamSubmission', () => {
        it('should detect honeypot trap submissions', () => {
            const submission: ContactFormData = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                msg: 'Hello',
                website_url: 'http://spammersite.com'
            };
            const result = isSpamSubmission(submission);
            expect(result.isSpam).toBe(true);
            expect(result.reason).toBe('Honeypot field filled');
        });

        it('should detect dot-stuffed Gmail submissions', () => {
            const submission: ContactFormData = {
                name: 'John Doe',
                email: 't.ap.af.ag.uf.iki.5.2@gmail.com',
                msg: 'Hello'
            };
            const result = isSpamSubmission(submission);
            expect(result.isSpam).toBe(true);
            expect(result.reason).toBe('Dot-stuffed Gmail pattern detected');
        });

        it('should detect high-entropy name submissions', () => {
            const submission: ContactFormData = {
                name: 'xIIodPSxdQiXLDKSK',
                email: 'john.doe@gmail.com',
                msg: 'Hello'
            };
            const result = isSpamSubmission(submission);
            expect(result.isSpam).toBe(true);
            expect(result.reason).toBe('High-entropy name pattern detected');
        });

        it('should pass clean submissions', () => {
            const submission: ContactFormData = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                msg: 'Hello, I would like to inquire about your services.'
            };
            const result = isSpamSubmission(submission);
            expect(result.isSpam).toBe(false);
        });
    });
});

describe('sendEmail API logic', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        vi.stubEnv('VITE_EMAIL_API_URL', 'https://mock-email-service.com/send');
        vi.stubEnv('VITE_EMAIL_API_KEY', 'mock-api-key');
        vi.stubEnv('VITE_EMAIL_TO', 'admin@mock.com');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('should return mock success and silently drop emails identified as spam', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });
        const submission: ContactFormData = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            msg: 'Spam msg',
            website_url: 'http://spammer.com'
        };

        const result = await sendEmail(submission);
        expect(result.success).toBe(true);
        expect(result.message).toContain('Thanks for your message');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('[Anti-Spam Filter] Submission dropped silently')
        );
    });

    it('should return mock success if email environment variables are missing', async () => {
        vi.stubEnv('VITE_EMAIL_API_URL', '');
        vi.stubEnv('VITE_EMAIL_API_KEY', '');
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        });

        const submission: ContactFormData = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            msg: 'Normal message'
        };

        const result = await sendEmail(submission);
        expect(result.success).toBe(true);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('[Email Service Demo] Contact submission received:'),
            submission
        );
    });

    it('should call fetch API and return success on a 200 OK response', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        });
        global.fetch = fetchMock;

        const submission: ContactFormData = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            phone: '123-456-7890',
            msg: 'Normal message',
            recaptchaToken: 'mock-recaptcha-token'
        };

        const result = await sendEmail(submission);
        expect(result.success).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        const [calledUrl, calledOptions] = fetchMock.mock.calls[0];
        expect(calledUrl).toBe('https://mock-email-service.com/send');
        expect(calledOptions.method).toBe('POST');
        expect(calledOptions.headers).toEqual({
            'Content-Type': 'application/json',
            'X-API-Key': 'mock-api-key'
        });

        const parsedBody = JSON.parse(calledOptions.body);
        expect(parsedBody.to).toBe('admin@mock.com');
        expect(parsedBody.replyTo).toBe('john.doe@gmail.com');
        expect(parsedBody.reply_to).toBe('john.doe@gmail.com');
        expect(parsedBody.recaptchaToken).toBe('mock-recaptcha-token');
        expect(parsedBody.__recaptcha_token).toBe('mock-recaptcha-token');
        expect(parsedBody.__header_x_api_key).toBe('mock-api-key');
        expect(parsedBody.html).toContain('Novo Formulário de Contato');
        expect(parsedBody.html).toContain('john.doe@gmail.com');
        expect(parsedBody.html).toContain('123-456-7890');
        expect(parsedBody.html).toContain('Normal message');
    });

    it('should return error when fetch API returns non-OK status', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Internal Server Error' })
        });
        global.fetch = fetchMock;

        const submission: ContactFormData = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            msg: 'Normal message'
        };

        const result = await sendEmail(submission);
        expect(result.success).toBe(false);
        expect(result.message).toContain('Failed to send message');
    });

    it('should catch errors and return failure on API network exception', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        });
        const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
        global.fetch = fetchMock;

        const submission: ContactFormData = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            msg: 'Normal message'
        };

        const result = await sendEmail(submission);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Network error');
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
