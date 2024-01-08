const fs = require('fs-extra');
const path = require('path');
const pkg = require('./package.json');

!fs.exists(path.join(__dirname, pkg.paths.public, 'mix-manifest.json'), () => {
    fs.writeJson(path.join(__dirname, pkg.paths.public, 'mix-manifest.json'), {
        "/js/app.js": null,
        "/css/app.css": null
    });
});
