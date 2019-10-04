
import http from '../lib/http';
import log from '../lib/log';

class Account {
    symbol;

    constructor(symbol) {
        this.symbol = symbol;
    }

    getOverview = async () => {
        // GET /api/v1/account-overview
        let result = false;

        try {
            /*
            { 
                "code": "200000",
                "data": {
                    "accountEquity": 99.8999305281, //账户权益
                    "unrealisedPNL": 0, //未实现盈亏
                    "marginBalance": 99.8999305281, //保证金余额
                    "positionMargin": 0, //仓位保证金
                    "orderMargin": 0, //委托保证金
                    "frozenFunds": 0, //转出提现冻结
                    "availableBalance": 99.8999305281 //可用余额
                }
            }
            */
            const { data } = await http.get('/api/v1/account-overview');
            result = data;
        } catch (e) {
            log('get account overview error', e);
        }
        return result;
    }
}

export default Account;