import { listen, qs, setAtt } from './helpers';
import { Modal } from 'bootstrap';
import axios from 'axios';
import { load } from 'recaptcha-v3';

(() => {
    // Variables
    const contact = qs('.contact');
    const modal = qs('#contact');
    const captcha = qs('[name=hiddenRecaptcha]');

    const form = qs('form[name=contact]');
    const fieldset = qs('fieldset', form);
    const success = qs('.success', form);
    const warning = qs('.warning', form);

    const query = new URLSearchParams(window.location.search);

    // Recaptcha
    load(process.env.MIX_RECAPTCHA_KEY, {
        autoHideBadge: true
    }).then((recaptcha) => {
        recaptcha.execute('submit').then((t) => {
            setAtt(captcha, 'value', t);
        });
    });

    // Btn modal open
    listen(contact, 'click', () => {
        (new Modal(modal)).show();
        dataLayer.push({
            'event': 'Modal open btn'
        });
    });

    // Url modal open
    if (query && query.has('contact')) {
        (new Modal(modal)).show();
        dataLayer.push({
            'event': 'Modal open url'
        });
    }

    // Form submit
    listen(form, 'submit', (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('subj', 'leowebguy | contact');
        data.append('to', process.env.MIX_EMAIL_TO || 'leowebguy@gmail.com');
        data.append('bcc', null); // do not bcc myself
        data.append('name', qs('[name=name]', form).value || '');
        data.append('phone', qs('[name=phone]', form).value || '');
        data.append('from', qs('[name=email]', form).value);
        data.append('msg', qs('[name=msg]', form).value);
        // data.append('hostname', window.location.hostname);
        data.append('token', qs('[name=hiddenRecaptcha]', form).value);
        axios.post('https://api.gaunte.com/sendmail/', data) // test > https://gaunteapi.ddev.site/sendmail/
            .then((r) => {
                if (r.data.result) {
                    form.reset();
                    fieldset.classList.add('d-none');
                    success.classList.remove('d-none');
                    dataLayer.push({
                        'event': 'Form'
                    });
                } else {
                    warning.classList.remove('d-none');
                    console.error(r.data.message);
                    dataLayer.push({
                        'event': 'Form error'
                    });
                }
            })
            .catch((err) => {
                warning.classList.remove('d-none');
                console.error(err);
                dataLayer.push({
                    'event': 'Form error'
                });
            });
    });
})();
