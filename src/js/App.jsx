import { useEffect, useState } from 'react';
import { Mail, X } from 'lucide-react';

function GithubIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round">
            <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
    );
}

function LinkedinIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
        </svg>
    );
}

function StackOverflowIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path
                d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731h10.66v-2.136H6.111v2.136zm.292-4.872l10.37 2.477.5-2.083-10.37-2.477-.5 2.083zm1.423-4.754l9.146 5.485 1.083-1.842-9.146-5.485-1.083 1.842zm3.17-4.223l7.098 7.975 1.583-1.411-7.098-7.975-1.583 1.411zm5.712-3.124l-1.921 1.011 4.707 8.948 1.921-1.011-4.707-8.948z"/>
        </svg>
    );
}

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        msg: ''
    });

    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error' | 'captcha-error'

    useEffect(() => {
        // Open modal if URL query param contains 'contact'
        const query = new URLSearchParams(window.location.search);
        if (query && query.has('contact')) {
            setIsModalOpen(true);
        }
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');

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

        fetch(process.env.VITE_EMAIL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.VITE_EMAIL_API_KEY
            },
            body: JSON.stringify({
                to: process.env.VITE_EMAIL_TO,
                subject: 'leowebguy | contact',
                html: html
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.success) {
                    setFormState({ name: '', email: '', phone: '', msg: '' });
                    setStatus('success');
                } else {
                    setStatus('error');
                    console.error(data ? data.error : 'Unknown error');
                }
            })
            .catch((err) => {
                setStatus('error');
                console.error(err);
            });
    };

    return (
        <>
        <div className="container mx-auto px-4 my-6 md:my-12 max-w-5xl">
            <div className="p-6 md:p-10 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="w-full lg:w-4/12 order-1 lg:order-2 flex justify-center">
                        <img src="img/leo.jpg" alt="leowebguy"
                             className="aspect-square shadow-lg border-2 border-slate-700 w-80 h-80 md:w-64 md:h-64 object-cover"/>
                    </div>
                    <div className="w-full lg:w-8/12 order-2 lg:order-1">
                        <h4 className="text-xl md:text-2xl font-medium leading-relaxed text-slate-100">
                            Senior AI Development Expert with 14+ years of experience building high-performance web solutions for businesses of all sizes, from agile startups to enterprise corporations.
                        </h4>

                        <div className="my-6 border-t border-slate-700/60 w-full"></div>

                        <div className="flex flex-wrap items-center gap-2">
                            {technologies.map((tech) => {
                                if (tech.isDivider) {
                                    return <div key={tech.name} className="hidden md:block w-full h-0 my-0"></div>;
                                }
                                return (
                                    <img
                                        key={tech.name}
                                        alt={tech.name}
                                        src={`svg/${tech.icon}`}
                                        className="svg transition-transform hover:scale-110"
                                        title={tech.name}
                                    />
                                );
                            })}
                        </div>

                        <div className="my-6 border-t border-slate-700/60 w-full"></div>

                        <div className="flex flex-row items-center gap-3">
                            <a
                                href="//github.com/leowebguy"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                            >
                                <GithubIcon className="w-5 h-5"/>
                            </a>
                            <a
                                href="//linkedin.com/in/leowebguy"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                            >
                                <LinkedinIcon className="w-5 h-5"/>
                            </a>
                            <a
                                href="//stackoverflow.com/users/3058927/leo-leoncio"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                            >
                                <StackOverflowIcon className="w-5 h-5"/>
                            </a>
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md"
                            >
                                <Mail className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    {/* Contact Modal */
    }
    {
        isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <form name="contact" onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
                            <h4 className="text-lg font-semibold text-slate-100">Reach out</h4>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="p-6">
                            <fieldset disabled={status === 'submitting'} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                    rows="5"
                                    placeholder="Your message here (required)"
                                    maxLength="255"
                                    value={formState.msg}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                                <div className="flex flex-row items-center justify-end gap-4 pt-2">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors shadow-md disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            </fieldset>

                            {status === 'success' && (
                                <div
                                    className="p-4 mt-4 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-emerald-200 text-sm">
                                    Thanks for your message!<br/>I'll reach out as soon as possible
                                </div>
                            )}

                            {status === 'error' && (
                                <div
                                    className="p-4 mt-4 bg-amber-950/60 border border-amber-700/60 rounded-lg text-amber-200 text-sm">
                                    Sorry, something went wrong. Please send an email to leowebguy@gmail.com
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
</>
)
    ;
}
