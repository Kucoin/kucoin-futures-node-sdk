require('babel-register');

global._RUN_AS_FRAMEWORK_HELPER_ = true;

const path = require('path');
// const fs = require('fs');

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    process.exit(1) // To exit with a 'failure' code
});

const [$node, $start, $appName] = process.argv;
const appName = $appName || 'template';
const modulePath = path.resolve(
    __dirname,
    '../app/',
    `${appName}.js`
);

require(modulePath);