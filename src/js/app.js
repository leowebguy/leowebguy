import { listen, qs, setAtt } from './helpers';
import { Modal } from 'bootstrap';
import axios from 'axios';

(() => {
    // Variables
    const btnContact = qs('.contact');
    const modalContact = qs('#contact');
    const captcha = qs('[name=hiddenRecaptcha]');
    const captchaBadge = qs('.grecaptcha-badge');

    const form = qs('form[name=contact]');
    const formFieldset = qs('fieldset', form);
    const formSuccess = qs('.alert-success', form);
    const formError = qs('.alert-warning', form);
    const formSubmit = qs('button[type=submit]', form);

    const query = new URLSearchParams(window.location.search);

    // Events
    listen(btnContact, 'click', () => {
        (new Modal(modalContact)).show();

        dataLayer.push({
            'event': 'Modal open btn'
        });

        return;
    });

    if (query && query.has('contact')) {
        (new Modal(modalContact)).show();

        dataLayer.push({
            'event': 'Modal open url'
        });
    }

    listen(document, 'readystatechange', () => {
        if (document.readyState === 'complete' && grecaptcha.ready) {
            grecaptcha
                .execute('6Lfe55gUAAAAALT63VWPk0DsLRlh-cK77Bv0QkVL')
                .then((token) => {
                    setAtt(captcha, 'value', token);
                });
        }
    });

    listen(form, 'submit', (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('subj', 'leowebguy | contact');
        data.append('to', 'leowebguy@gmail.com');
        data.append('bcc', null); // do not bcc myself
        data.append('name', qs('[name=name]', form).value || '');
        data.append('phone', qs('[name=phone]', form).value || '');
        data.append('from', qs('[name=email]', form).value);
        data.append('msg', qs('[name=msg]', form).value);

        axios.post('https://api.gaunte.com/sendmail/', data)
            .then((r) => {
                if (r.data.result) {
                    form.reset();
                    formFieldset.classList.add('d-none');
                    formSubmit.classList.add('d-none');
                    formSuccess.classList.remove('d-none');

                    dataLayer.push({
                        'event': 'Form'
                    });

                } else {
                    // form.reset();
                    // formFieldset.classList.add('d-none');
                    // formSubmit.classList.add('d-none');
                    formError.classList.remove('d-none');

                    console.error(r.data.message);

                    dataLayer.push({
                        'event': 'Form error'
                    });
                }
            })
            .catch((err) => {
                // form.reset();
                // formFieldset.classList.add('d-none');
                // formSubmit.classList.add('d-none');
                formError.classList.remove('d-none');

                console.error(err);

                dataLayer.push({
                    'event': 'Form error'
                });
            });
    });
})();
