const webpack = require('webpack'),
    pkg = require('./package.json'),
    path = require('path'),
    glob = require('glob'),
    autoprefixer = require('autoprefixer'),
    gitRevSync = require('git-rev-sync'),
    WebpackBrowserSync = require('browser-sync-webpack-plugin'),
    WebpackCompress = require('compression-webpack-plugin'),
    WebpackCopy = require('copy-webpack-plugin'),
    WebpackCssExtract = require('mini-css-extract-plugin'),
    WebpackCssMinimizer = require('css-minimizer-webpack-plugin'),
    WebpackHandlebars = require('handlebars-webpack-plugin'),
    WebpackTerser = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

module.exports = () => {
    const isProd = process.env.NODE_ENV === 'production';
    const t = process.env.GITHUB_RUN_ID || Date.now();
    return {
        mode: process.env.NODE_ENV,
        entry: {
            app: [
                path.join(__dirname, pkg.paths.src, 'js', 'app.js'),
                path.join(__dirname, pkg.paths.src, 'scss', 'app.scss')
            ]
        },
        output: {
            filename: 'js/[name].js',
            path: path.join(__dirname, pkg.paths.dist),
            clean: false
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node-modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.s?css$/,
                    use: [
                        WebpackCssExtract.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                import: true,
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        autoprefixer
                                    ]
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    quietDeps: true,
                                    silenceDeprecations: [
                                        'mixed-decls',
                                        'color-functions',
                                        'global-builtin',
                                        'import'
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            !isProd && new webpack.ProgressPlugin(),
            new WebpackBrowserSync({
                host: 'localhost',
                port: '8080',
                server: { baseDir: ['dist'] },
                files: [
                    path.join(__dirname, pkg.paths.dist, 'css', '*.css'),
                    path.join(__dirname, pkg.paths.dist, 'js', '*.js'),
                    path.join(__dirname, pkg.paths.dist, '**/*.html')
                ]
            }),
            isProd && new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    path.join(__dirname, pkg.paths.dist, 'js', '**/*'),
                    path.join(__dirname, pkg.paths.dist, 'css', '**/*')
                ]
            }),
            new WebpackHandlebars({
                entry: path.join(__dirname, pkg.paths.src, '*.hbs'),
                output: path.join(__dirname, pkg.paths.dist, '[name].html'),
                data: {
                    vendorJS: `js/vendor.js?v=${t}`,
                    appJS: `js/app.js?v=${t}`,
                    appCSS: `css/app.css?v=${t}`
                },
                partials: [
                    path.join(__dirname, pkg.paths.src, 'partials', '*.hbs')
                ]
            }),
            new WebpackCssExtract({
                filename: 'css/[name].css'
            }),
            new PurgeCSSPlugin({
                paths: glob.sync(path.join(__dirname, pkg.paths.src, '**/*.hbs'), { nodir: true }),
                safelist: ['active', 'modal-backdrop', 'fade', 'show']
            }),
            isProd && new WebpackCopy({
                patterns: [
                    { from: path.join(__dirname, pkg.paths.src, 'CNAME'), to: path.join(__dirname, pkg.paths.dist) },
                    { from: path.join(__dirname, pkg.paths.src, 'favicons/favicon.ico'), to: path.join(__dirname, pkg.paths.dist) },
                    { from: path.join(__dirname, pkg.paths.src, 'favicons'), to: path.join(__dirname, pkg.paths.dist, 'favicons') },
                    { from: path.join(__dirname, pkg.paths.src, 'svg'), to: path.join(__dirname, pkg.paths.dist, 'svg') },
                    { from: path.join(__dirname, pkg.paths.src, 'img'), to: path.join(__dirname, pkg.paths.dist, 'img') },
                    // fonts
                    { from: path.join(__dirname, pkg.paths.npm, 'bootstrap-icons/font/fonts'), to: path.join(__dirname, pkg.paths.dist, 'fonts/bi') },
                    { from: path.join(__dirname, pkg.paths.src, 'fonts'), to: path.join(__dirname, pkg.paths.dist, 'fonts') }
                ]
            }),
            !isProd && new webpack.SourceMapDevToolPlugin({
                test: /\.js$/,
                filename: 'js/[name].js.map'
            }),
            isProd && new WebpackCompress({
                test: /\.js$/,
                filename: `js/[name].gz`,
                algorithm: 'gzip'
            }),
            isProd && new WebpackCompress({
                test: /\.css$/,
                filename: `css/[name].gz`,
                algorithm: 'gzip'
            }),
            new WebpackManifestPlugin({
                fileName: path.join(__dirname, pkg.paths.dist, 'manifest.json'),
                publicPath: '/',
                generate: (seed, files) => {
                    const manifest = {};
                    files.forEach(file => {
                        if (file.path.match(/(fonts|svg|img|favicons|CNAME)\//)) {
                            return;
                        }
                        manifest[file.path] = `${file.path}?v=${t}`;
                    });
                    return { ...pkg.manifest, ...manifest };
                }
            }),
            isProd && new webpack.BannerPlugin({
                banner: [
                    '/**',
                    ` * @project        ${pkg.name} | ${gitRevSync.date()}`,
                    ` * @author         ${pkg.author.name} <${pkg.author.email}>`,
                    ` * @release        ${gitRevSync.remoteUrl()} [branch: ${gitRevSync.branch()}]`,
                    ` * @copyright      Copyright (c)`,
                    ` */\n`
                ].join('\n')
            })
        ],
        optimization: {
            minimize: isProd,
            minimizer: [
                new WebpackTerser(),
                new WebpackCssMinimizer()
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            }
        }
    };
};
