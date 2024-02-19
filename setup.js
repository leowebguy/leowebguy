const fs = require('fs-extra');
const path = require('path');
const pkg = require('./package.json');
const manifest = require('./docs/mix-manifest.json');

!fs.exists(path.join(__dirname, pkg.paths.public, 'mix-manifest.json'), () => {
    fs.writeJson(path.join(__dirname, pkg.paths.public, 'mix-manifest.json'), {
        '/js/manifest.js': '/js/manifest.js',
        '/js/vendor.js': '/js/vendor.js',
        '/js/app.js': '/js/app.js',
        '/css/app.css': '/css/app.css'
    });
});
