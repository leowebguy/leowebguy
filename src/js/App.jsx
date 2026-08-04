import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

const technologies = [
    { name: 'PHP', icon: 'php.svg' },
    { name: 'Craft CMS', icon: 'craftcms.svg' },
    { name: 'Laravel', icon: 'laravel.svg' },
    { name: 'Yii', icon: 'yii.svg' },
    { name: 'Symfony', icon: 'symfony.svg' },
    { name: 'Shopify', icon: 'shopify.svg' },
    { name: 'WordPress', icon: 'wp.svg' },
    { name: 'divider1', isDivider: true },
    { name: 'Docker', icon: 'docker.svg' },
    { name: 'Linux', icon: 'linux.svg' },
    { name: 'Ubuntu', icon: 'ubuntu.svg' },
    { name: 'AWS', icon: 'aws.svg' },
    { name: 'Cloudflare', icon: 'cloudflare.svg' },
    { name: 'Digital Ocean', icon: 'do.svg' },
    { name: 'Google Cloud', icon: 'googlecloud.svg' },
    { name: 'Github', icon: 'github.svg' },
    { name: 'MySQL', icon: 'mysql.svg' },
    { name: 'PostgreSQL', icon: 'postgre.svg' },
    { name: 'MariaDB', icon: 'mariadb.svg' },
    { name: 'Redis', icon: 'redis.svg' },
    { name: 'divider2', isDivider: true },
    { name: 'NodeJS', icon: 'node.svg' },
    { name: 'NPM', icon: 'npm.svg' },
    { name: 'JavaScript', icon: 'js.svg' },
    { name: 'NuxtJS', icon: 'nuxt.svg' },
    { name: 'VueJs', icon: 'vue.svg' },
    { name: 'Veutify', icon: 'veutify.svg' },
    { name: 'ReactJs', icon: 'react.svg' },
    { name: 'GraphQL', icon: 'graphql.svg' },
    { name: 'AlpineJs', icon: 'alpine.svg' },
    { name: 'Webpack', icon: 'webpack.svg' },
    { name: 'Vite', icon: 'vite.svg' },
    { name: 'Sass', icon: 'sass.svg' },
    { name: 'Bootstrap', icon: 'bootstrap.svg' },
    { name: 'Tailwind', icon: 'tailwind.svg' }
];

export default function App() {
    const modalRef = useRef(null);
    const modalInstanceRef = useRef(null);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        msg: ''
    });

    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error' | 'captcha-error'

    useEffect(() => {
        if (modalRef.current) {
            modalInstanceRef.current = new Modal(modalRef.current);

            // Open modal if URL query param contains 'contact'
            const query = new URLSearchParams(window.location.search);
            if (query && query.has('contact')) {
                modalInstanceRef.current.show();
            }
        }
        return () => {
            if (modalInstanceRef.current) {
                modalInstanceRef.current.dispose();
            }
        };
    }, []);

    const handleOpenModal = () => {
        if (modalInstanceRef.current) {
            modalInstanceRef.current.show();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Recaptcha
        const token = (window.grecaptcha && window.grecaptcha.getResponse()) || '';
        if (!token || token.length < 10) {
            setStatus('captcha-error');
            setTimeout(() => setStatus('idle'), 5000);
            return;
        }

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #333;">Novo Formulário de Contato</h2>
                <p><strong>Nome:</strong> ${formState.name}</p>
                <p><strong>E-mail:</strong> ${formState.email}</p>
                <p><strong>Telefone:</strong> ${formState.phone || 'Não informado'}</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin-top: 15px; border-radius: 4px;">
                    <strong>Mensagem:</strong><br>
                    ${formState.msg.replace(/\n/g, '<br>')}
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
                    setFormState({ name: '', email: '', phone: '', msg: '' });
                    if (window.grecaptcha) {
                        window.grecaptcha.reset();
                    }
                    setStatus('success');
                } else {
                    setStatus('error');
                    console.error(r.data ? r.data.error : 'Unknown error');
                }
            })
            .catch((err) => {
                setStatus('error');
                console.error(err);
            });
    };

    return (
        <>
            <div className="container my-3 my-md-6">
                <div className="p-4 border shadow-lg">
                    <div className="row align-items-center gap-3 gap-md-0">
                        <div className="col-lg-4 offset-lg-1 mb-4 mb-lg-0 order-lg-2">
                            <img src="img/leo.jpg" alt="leowebguy" className="img-fluid" />
                        </div>
                        <div className="col-lg-7 order-lg-1">
                            <h4>Web Engineer, PHP & Craft CMS expert with 14+ yrs of experience working with clients ranging from small businesses to large corporations.</h4>

                            <div className="d-flex my-3 my-md-4 w-100"></div>

                            <div className="d-flex flex-wrap gap-2">
                                {technologies.map((tech) => {
                                    if (tech.isDivider) {
                                        return <div key={tech.name} className="d-md-flex d-none w-100"></div>;
                                    }
                                    return (
                                        <img
                                            key={tech.name}
                                            alt={tech.name}
                                            src={`svg/${tech.icon}`}
                                            className="svg"
                                            title={tech.name}
                                        />
                                    );
                                })}
                            </div>

                            <div className="d-flex my-3 my-md-4 w-100"></div>

                            <div className="d-flex flex-row gap-2">
                                <a href="//github.com/leowebguy" target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                                    <i className="bi bi-github"></i>
                                </a>
                                <a href="//linkedin.com/in/leowebguy" target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                                <a href="//stackoverflow.com/users/3058927/leo-leoncio" target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                                    <i className="bi bi-stack-overflow"></i>
                                </a>
                                <button type="button" onClick={handleOpenModal} className="btn btn-secondary contact">
                                    <i className="bi bi-envelope-at"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            <div className="modal fade" id="contact" ref={modalRef} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form name="contact" onSubmit={handleSubmit}>
                            <div className="modal-header bg-secondary">
                                <h4 className="modal-title text-dark">Reach out</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <fieldset disabled={status === 'submitting'}>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control mb-3"
                                        placeholder="Name (required)"
                                        maxLength="60"
                                        autoComplete="name"
                                        value={formState.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control mb-3"
                                        placeholder="Email (required)"
                                        autoComplete="email"
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control mb-3"
                                        placeholder="Phone"
                                        autoComplete="tel"
                                        value={formState.phone}
                                        onChange={handleInputChange}
                                    />
                                    <textarea
                                        name="msg"
                                        className="form-control mb-3"
                                        rows="6"
                                        placeholder="Your message here (required)"
                                        maxLength="255"
                                        value={formState.msg}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                    <div className="d-flex justify-content-end gap-3 align-items-center">
                                        <div
                                            className="g-recaptcha"
                                            data-sitekey={process.env.WEBPACK_RECAPTCHA_KEY || '6Lct-SQUAAAAADK1vfAdFWhUCpXmHKsIuBBq3Vjb'}
                                        ></div>
                                        <button type="submit" className="btn btn-lg btn-secondary px-5">
                                            {status === 'submitting' ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </fieldset>

                                {status === 'success' && (
                                    <div className="alert alert-light success w-100 mt-3">
                                        Thanks for your message!<br />I'll reach out as soon as possible
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="alert alert-warning warning w-100 mt-3">
                                        Sorry, something went wrong. Please send an email to leowebguy@gmail.com
                                    </div>
                                )}

                                {status === 'captcha-error' && (
                                    <div className="alert alert-warning captcha w-100 mt-3">
                                        Please complete the CAPTCHA
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
