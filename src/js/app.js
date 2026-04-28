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

            const data = new FormData();
            data.append('subj', 'leowebguy | contact');
            data.append('to', 'leowebguy@gmail.com');
            data.append('bcc', null); // do not bcc myself
            data.append('name', qs('[name=name]', form).value || '');
            data.append('phone', qs('[name=phone]', form).value || '');
            data.append('from', qs('[name=email]', form).value);
            data.append('msg', qs('[name=msg]', form).value);
            data.append('token', token);
            axios.post('https://api.gaunte.dev/sendmail/', data)
                .then((r) => {
                    if (r.data.result) {
                        form.reset();
                        fieldset.classList.add('d-none');
                        success.classList.remove('d-none');
                        // dataLayer.push({
                        //     'event': 'Form'
                        // });
                    } else {
                        warning.classList.remove('d-none');
                        console.error(r.data.message);
                        // dataLayer.push({
                        //     'event': 'Form error'
                        // });
                    }
                })
                .catch((err) => {
                    warning.classList.remove('d-none');
                    console.error(err);
                    // dataLayer.push({
                    //     'event': 'Form error'
                    // });
                });
        });
})();
