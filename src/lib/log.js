import moment from 'moment';

const log = (...props) => {
    const ts = Date.now();
    const date = moment(ts).format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${date}][${ts}]`, ...props);
}

export default log;