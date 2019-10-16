import log4js from 'log4js';
import path from 'path';
import moment from 'moment';
import { getEnv } from './env';

const configure = getEnv();
const LOG_TYPES = ['warn', 'info', 'debug', 'error'];

class Log {
    constructor() {
        const { writeFile, stdout } = configure.log || {};
        this.writeFile = writeFile;
        this.stdout = stdout;
    }

    init = () => {
        if (!this.writeFile && !this.stdout) {
            return;
        }

        const nowTime = moment().format('YYYY-MM-DD_HH:mm:ss');
        log4js.configure({
            appenders: {
                out: { type: 'stdout' },
                writeFile: { type: 'file', filename: path.resolve(__dirname, `../../logs/${nowTime}.log`) }
            },
            categories: {
                default: {
                    appenders: this.writeFile ? ['writeFile'] : ['out'],
                    level: 'debug',
                },
            },
        });
        // 注入常用方法，不用再次获取实例
        LOG_TYPES.forEach((method)=> {
            this[method] = (msg, logger) => {
                this.log(msg, method, logger);
            }
        })
    }

    getLogger = (logger) => {
        return log4js.getLogger(logger);
    }

    log = (msg, type = 'info', logger) => {
        if (!this.writeFile && !this.stdout) {
            return;
        }

        const _logger = this.getLogger(logger);
        _logger[type](msg)
    }
}

const log4 = new Log();
log4.init();

const log = (...props) => {
    const lastP = props[props.length - 1];
    const isDefinedMethod = LOG_TYPES.indexOf(lastP) > -1;
    const _type = isDefinedMethod ? lastP : 'info';
    const _str = props.slice(0, isDefinedMethod ? -1 : undefined).reduce((sum, cur) => {
        return sum + '  ' + JSON.stringify(cur) + '  '
    }, '')
    const logger = log4.getLogger();
    logger[_type](`${_str}`);
}

export default log;