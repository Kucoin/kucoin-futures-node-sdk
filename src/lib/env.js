const fs = require('fs');
const path = require('path');

let env = {
	log: {
		writeFile: false,
		stdout: false,
	},
	key: '',
	secret: '',
	passphrase: '',
};

if (global._RUN_AS_FRAMEWORK_HELPER_) {
    const envFile = path.resolve(__dirname, '../../.env.js');
    if (fs.existsSync(envFile)) {
        const r = require(envFile);
        const c = r.default || r;
        if (c) {
            env = c;
        }
    }
}

export const setEnv = (conf = {}) => {
    env = {
        ...env,
        ...conf,
    };
};

export const getEnv = () => {
    return env;
};
