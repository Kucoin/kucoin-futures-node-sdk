import moment from 'moment';
import log4js from 'log4js';
import path from 'path';


const LOG_TYPES = ['warn', 'info', 'debug', 'error'];



  class Log {

     init(config ={ saveInFile: true }) {
         const context = this;
        log4js.configure({
            appenders: {
              out: {type: 'stdout'},
              everything: { type: 'file', filename: path.resolve(__dirname, '../logs/all-the-logs.log') }
            },
            categories: {
              default: { appenders: config.saveInFile ? [ 'out','everything' ]: ['out'], level: 'debug' }
            }
         });
         // 注入常用方法，不用再次获取实例
         LOG_TYPES.forEach((method)=> {
            context[method] = (msg, logger) => {
                context.log(msg, method, logger)
             }
         })
     }

     getLogger(logger) {
         return log4js.getLogger(logger);
     }

     log(msg, type = 'info', logger) {
         const _logger = this.getLogger(logger);
         _logger[type](msg)
     }

  }

const log4 = new Log();

const log = (...props) => {
    const lastP = props[props.length - 1]
    const isDefinedMethod = LOG_TYPES.indexOf(lastP) > -1;
    const _type = isDefinedMethod ? lastP : 'info';
    const _str = props.slice(0, isDefinedMethod ? -1:undefined).reduce((sum, cur) => {
        return sum + '  ' + JSON.stringify(cur) + '  '
    }, '')
    const logger = log4.getLogger();
    logger[_type](`${_str}`,)
}

export { log4 }

export default log;