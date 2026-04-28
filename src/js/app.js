import { isDefined, listen, qs } from './helpers.js';
import { Modal } from 'bootstrap';
import axios from 'axios';

(() => {
    // Variables
    const contact = qs('.contact');
    const modal = qs('#contact');
    const response = qs('[name=cf-turnstile-response]');

    const form = qs('form[name=contact]');
    const fieldset = qs('fieldset', form);
    const success = qs('.success', form);
    const warning = qs('.warning', form);
    const turnstile = qs('.turnstile', form);

    const query = new URLSearchParams(window.location.search);

    // Btn modal open
    if (isDefined(modal))
        listen(contact, 'click', () => {
            (new Modal(modal)).show();
        });

    // Url modal open
    if (isDefined(modal) && query && query.has('contact'))
        (new Modal(modal)).show();

    // Form submit
    if (isDefined(form))
        listen(form, 'submit', (e) => {
            e.preventDefault();

            // Turnstile
            if (!response.value) {
                turnstile.classList.remove('d-none');
                setTimeout(() => turnstile.classList.add('d-none'), 5000);
                return;
            }

            // Send email
            const data = new FormData();
            data.append('subj', 'leowebguy | contact');
            data.append('to', 'leowebguy@gmail.com');
            data.append('bcc', null); // do not bcc myself
            data.append('name', qs('[name=name]', form).value || '');
            data.append('phone', qs('[name=phone]', form).value || '');
            data.append('from', qs('[name=email]', form).value);
            data.append('msg', qs('[name=msg]', form).value);
            data.append('token', turnstile.value);
            axios.post('https://api.gaunte.com/sendmail/', data)
                .then((r) => {
                    if (r.data.result) {
                        form.reset();
                        fieldset.classList.add('d-none');
                        success.classList.remove('d-none');
                    } else {
                        warning.classList.remove('d-none');
                        console.error(r.data.message);
                    }
                })
                .catch((err) => {
                    warning.classList.remove('d-none');
                    console.error(err);
                });
        });
})();
