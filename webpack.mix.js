const mix = require('laravel-mix'),
    pkg = require('./package.json'),
    fs = require('fs-extra'),
    path = require('path'),
    manifest = require('./docs/mix-manifest.json'),
    handlebars = require('handlebars-webpack-plugin'),
    gitRevSync = require('git-rev-sync');

require('laravel-mix-banner');
// require('laravel-mix-handlebars');
require('laravel-mix-compress');
require('laravel-mix-purgecss');
// require('laravel-mix-bundle-analyzer');
// require('laravel-mix-criticalcss');

mix

    .setPublicPath(pkg.paths.public)

    .disableNotifications()

    .options({
        processCssUrls: false,
        autoprefixer: {
            enabled: true,
            options: {remove: false}
        }
    })

    // .before()

    .webpackConfig({
        // resolve: {
        //     modules: [
        //         path.join(__dirname, pkg.paths.npm)
        //     ]
        // },
        devServer: {
            // open: true,
            // server: 'https',
            host: 'localhost',
            port: 8080,
            https: {
                cert: fs.readFileSync(path.join(__dirname, pkg.paths.ssl, 'cert.pem')),
                key: fs.readFileSync(path.join(__dirname, pkg.paths.ssl, 'key.pem'))
            },
            liveReload: true
        },
        plugins: [
            new handlebars({
                entry: path.join(__dirname, pkg.paths.src, '*.hbs'),
                output: path.join(__dirname, pkg.paths.public, '[name].html'),
                data: {
                    mixJs: manifest['/js/app.js'] || '/js/app.js',
                    mixCss: manifest['/css/app.css'] || '/css/app.css'
                },
                partials: [
                    path.join(__dirname, pkg.paths.src, 'partials', '*.hbs')
                ]
            })
        ]
    })

    // .autoload({
    //     jquery: ['$', 'window.jQuery']
    // })

    .js(`${pkg.paths.src}/js/app.js`, `${pkg.paths.public}/js/app.js`)

    .sass(`${pkg.paths.src}/scss/app.scss`, `${pkg.paths.public}/css/app.css`)

    .version()

    .sourceMaps(false);

if (mix.inProduction()) {

    mix

        .before(() => {
            fs.copySync(
                path.join(__dirname, pkg.paths.npm, 'bootstrap-icons/font/fonts'),
                path.join(__dirname, pkg.paths.public, 'fonts/bi')
            );
            // fs.copySync(
            //     path.join(__dirname, pkg.paths.src, 'svg'),
            //     path.join(__dirname, pkg.paths.public, 'svg')
            // );
        })

        // .purgeCss({
        //     content: [`${pkg.paths.src}/**/*.hbs`],
        //     whitelistPatterns: [/d-$/, /modal-$/, /fade/, /show/]
        // })

        .compress()

        .banner({
            banner: (() => {
                return [
                    `/**`,
                    ` * @project        ${pkg.name}`,
                    ` * @author         ${pkg.author.name} | ${pkg.author.email}`,
                    ` * @build          ${gitRevSync.date().toISOString()}`,
                    ` * @repo           ${gitRevSync.remoteUrl()} [branch: ${gitRevSync.branch()}]`,
                    ` * @copyright      Copyright (c) ${gitRevSync.date().getFullYear()}`,
                    ` */\n`
                ].join('\n');
            })(),
            raw: true
        });

}
