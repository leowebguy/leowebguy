export default () => {
    const form = $('form[name=sendmail]')
    form.validate({
        errorClass: 'has-error',
        ignore: '',
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            msg: {
                required: true,
                minlength: 12
            },
            hiddenRecaptcha: {
                required: () => {
                    return grecaptcha.getResponse() === ''
                }
            }
        },
        messages: {
            // email: {
            // 	required: 'email is required',
            // 	email: 'a valid email is required'
            // },
            // msg: {
            // 	required: 'message is required',
            // 	minlength: 'message is too small'
            // },
            hiddenRecaptcha: {
                required: 'solve the captcha'
            }
        },
        highlight: function(el, err) {
            $(el).parents('.form-group').addClass(err)
        },
        unhighlight: function(el, err) {
            $(el).parents('.form-group').removeClass(err)
        },
        // errorPlacement: function(err, el){
        // 	return false;
        // },
        submitHandler: function(f, e) {
            e.preventDefault()

            let name = $('input[name=name]').val()
            let email = $('input[name=email]').val()
            //let phone = $('input[name=phone]').val()
            let message = $('textarea[name=msg]').val()

            let data = new FormData()
            //data.append('to', 'leowebguy@gmail.com')
            data.append('to', 'simmlerbjj@yahoo.com')
            data.append('name', name || '')
            data.append('from', email)
            data.append('subj', '508Tactical | Contact')
            data.append('msg', message)
            //data.append('bcc', 'nobcc')

            $.ajax({
                type: 'POST',
                url: 'https://api.gaunte.com/sendmail/',
                contentType: false,
                timeout: 0,
                processData: false,
                mimeType: 'multipart/form-data',
                data: data,
                success: function(r) {
                    r = $.parseJSON(r)
                    if (r.result) {
                        form.trigger('reset')
                        $('#block-answer')
                            .html('<div class="success-message">message sent!</div>')
                            .fadeIn()
                            .delay(6000)
                            .fadeOut()

                        console.log(`%c${r.message}`, 'color:green')
                    } else {
                        $('#block-answer')
                            .html('<div class="error-message">' + r.message + '</div>')
                            .fadeIn()

                        console.log(`%c${r.message}`, 'color:#f28')
                    }
                },
                error: function(r) {
                    r = $.parseJSON(r)
                    $('#block-answer')
                        .html('<div class="error-message">' + r.message + '</div>')
                        .fadeIn()

                    console.log(`%c${r.message}`, 'color:#f28')
                }
            })
        }
    })

    function recaptchaCallback() {
        $('[name=hiddenRecaptcha]').valid()
    }
};
