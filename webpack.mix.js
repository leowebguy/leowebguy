const mix = require('laravel-mix'),
    pkg = require('./package.json'),
    fs = require('fs-extra'),
    path = require('path'),
    handlebars = require('handlebars-webpack-plugin'),
    gitRevSync = require('git-rev-sync');

const t = process.env.GITHUB_RUN_ID || Date.now();

require('laravel-mix-banner');
// require('laravel-mix-handlebars');
require('laravel-mix-compress');
require('laravel-mix-purgecss');
// require('laravel-mix-bundle-analyzer');
// require('laravel-mix-criticalcss');

mix

    .setPublicPath(pkg.paths.dist)

    .disableNotifications()

    .options({
        processCssUrls: false,
        autoprefixer: {
            enabled: true,
            options: { remove: false }
        },
        runtimeChunkPath: 'js'
    })

    // .before()

    .webpackConfig({
        // resolve: {
        //     modules: [
        //         path.join(__dirname, pkg.paths.npm)
        //     ]
        // },
        devServer: {
            // server: 'https',
            host: 'localhost',
            port: 8080,
            // https: {
            //     cert: fs.readFileSync(path.join(__dirname, pkg.paths.ssl, 'cert.pem')),
            //     key: fs.readFileSync(path.join(__dirname, pkg.paths.ssl, 'key.pem'))
            // },
            // open: true,
            watch: true,
            liveReload: true
        },
        plugins: [
            new handlebars({
                entry: path.join(__dirname, pkg.paths.src, '*.hbs'),
                output: path.join(__dirname, pkg.paths.dist, '[name].html'),
                data: {
                    manifestJs: `/js/manifest.js?v=${t}`,
                    vendorJs: `/js/vendor.js?v=${t}`,
                    mixJs: `/js/app.js?v=${t}`,
                    mixCss: `/css/app.css?v=${t}`
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

    .js(`${pkg.paths.src}/js/app.js`, `${pkg.paths.dist}/js/app.js`)

    .sass(`${pkg.paths.src}/scss/app.scss`, `${pkg.paths.dist}/css/app.css`)

    .extract()

    .version()

    .sourceMaps(false);

if (mix.inProduction()) {

    mix

        .before(() => {
            fs.copySync(
                path.join(__dirname, pkg.paths.npm, 'bootstrap-icons/font/fonts'),
                path.join(__dirname, pkg.paths.dist, 'fonts/bi')
            );
            fs.copySync(
                path.join(__dirname, pkg.paths.src, 'svg'),
                path.join(__dirname, pkg.paths.dist, 'svg')
            );
            fs.copySync(
                path.join(__dirname, pkg.paths.src, 'img'),
                path.join(__dirname, pkg.paths.dist, 'img')
            );
            fs.copySync(
                path.join(__dirname, pkg.paths.src, 'fav'),
                path.join(__dirname, pkg.paths.dist, 'fav')
            );
            fs.copy(
                path.join(__dirname, pkg.paths.src, 'CNAME'),
                path.join(__dirname, pkg.paths.dist, 'CNAME')
            );
            fs.copy(
                path.join(__dirname, pkg.paths.src, 'fav/favicon.ico'),
                path.join(__dirname, pkg.paths.dist, 'favicon.ico')
            );
        })

        .purgeCss({
            content: [`${pkg.paths.src}/**/*.hbs`]
            // whitelistPatterns: [/d-$/, /modal-$/, /fade/, /show/]
        })

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
