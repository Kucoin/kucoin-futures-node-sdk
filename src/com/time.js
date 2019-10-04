
import http from '../lib/http';
import log from '../lib/log';

class Time {

    getTimestamp = async () => {
        // GET /api/v1/timestamp
        let result = false;

        try {
            /*
            {  
                "code":"200000",
                "msg":"success",
                "data":1546837113087
            }
            */
            const { data } = await http.get('/api/v1/timestamp');
            result = data;
        } catch (e) {
            log('get timestamp error', e);
        }
        return result;
    }
}

export default Time;