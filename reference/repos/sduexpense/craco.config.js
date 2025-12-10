// craco.config.js
const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#7c4dff',
                            '@link-color': '#7c4dff',
                            // ...other overrides
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
