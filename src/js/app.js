import { isDefined, listen, qs } from './helpers.js';
import { Modal } from 'bootstrap';
import axios from 'axios';

(() => {
    // Variables
    const contact = qs('.contact');
    const modal = qs('#contact');
    const form = qs('form[name=contact]');
    const fieldset = qs('fieldset', form);
    const success = qs('.success', form);
    const warning = qs('.warning', form);
    const captcha = qs('.captcha', form);

    const query = new URLSearchParams(window.location.search);

    // Button modal open
    if (isDefined(modal))
        listen(contact, 'click', () => {
            (new Modal(modal)).show();
            // dataLayer.push({
            //     'event': 'Modal open btn'
            // });
        });

    // URL modal open
    if (query && query.has('contact')) {
        (new Modal(modal)).show();
        // dataLayer.push({
        //     'event': 'Modal open url'
        // });
    }

    // Form submit
    if (isDefined(form))
        listen(form, 'submit', (e) => {
            e.preventDefault();

            // Recaptcha
            const token = grecaptcha.getResponse() || '';
            if (!token || token.length < 10) {
                captcha.classList.remove('d-none');
                setTimeout(() => captcha.classList.add('d-none'), 5000);
                return;
            }

            const name = qs('[name=name]', form).value || '';
            const email = qs('[name=email]', form).value || '';
            const phone = qs('[name=phone]', form).value || '';
            const msg = qs('[name=msg]', form).value || '';

            const html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #333;">Novo Formulário de Contato</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin-top: 15px; border-radius: 4px;">
                        <strong>Mensagem:</strong><br>
                        ${msg.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;

            axios.post(process.env.WEBPACK_EMAIL_API_URL, {
                to: process.env.WEBPACK_EMAIL_TO,
                subject: 'leowebguy | contact',
                html: html
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.WEBPACK_EMAIL_API_KEY
                }
            })
                .then((r) => {
                    if (r.data && r.data.success) {
                        form.reset();
                        fieldset.classList.add('d-none');
                        success.classList.remove('d-none');
                    } else {
                        warning.classList.remove('d-none');
                        console.error(r.data ? r.data.error : 'Unknown error');
                    }
                })
                .catch((err) => {
                    warning.classList.remove('d-none');
                    console.error(err);
                });
        });
})();
