import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { GithubIcon, LinkedinIcon, StackOverflowIcon } from './components/Icons';
import { TechStack } from './components/TechStack';
import { ContactModal } from './components/ContactModal';
import { Technology } from './types';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_KEY || '';

const technologies: Technology[] = [
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
  { name: 'Tailwind', icon: 'tailwind.svg' },
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Open modal if URL query param contains 'contact'
    const query = new URLSearchParams(window.location.search);
    if (query && query.has('contact')) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <div className="container mx-auto px-4 my-6 md:my-12 max-w-5xl">
        <div className="p-6 md:p-10 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-4/12 order-1 lg:order-2 flex justify-center">
              <img
                src="/images/leo.jpg"
                alt="leowebguy"
                className="aspect-square shadow-lg border-2 border-slate-700 w-80 h-80 md:w-64 md:h-64 object-cover"
              />
            </div>
            <div className="w-full lg:w-8/12 order-2 lg:order-1">
              <h4 className="text-xl md:text-2xl font-medium leading-relaxed text-slate-100">
                Senior AI Development Expert with 14+ years of experience building high-performance web solutions for businesses of all sizes, from agile startups to enterprise corporations.
              </h4>

              <div className="my-6 border-t border-slate-700/60 w-full"></div>

              <TechStack technologies={technologies} />

              <div className="my-6 border-t border-slate-700/60 w-full"></div>

              <div className="flex flex-row items-center gap-3">
                <a
                  href="//github.com/leowebguy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="//linkedin.com/in/leowebguy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="//stackoverflow.com/users/3058927/leo-leoncio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <StackOverflowIcon className="w-5 h-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </GoogleReCaptchaProvider>
  );
}

