let path = require('path');

module.exports = {
    // ...
    webpack: {
        configure: {
            resolve: {
                symlinks: false,
                modules: [
                    path.resolve('./src'),
                    path.resolve('C:/Users/tool/git/adminpanel/package/src/components'),
                    path.resolve('C:/Users/tool/git/adminpanel/package/src/typescript')
                ]
            },
            devServer: {
                watchOptions: {
                    poll: 250
                }
            }
        }
    }
};