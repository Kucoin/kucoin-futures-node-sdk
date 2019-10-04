
import http from '../lib/http';
import log from '../lib/log';

class Position {
    symbol;

    constructor(symbol) {
        this.symbol = symbol;
    }

    getPosition = async () => {
        // GET /api/v1/position?symbol=XBTUSDM
        let result = false;

        try {
            /*
            { 
                "code": "200000",
                "data":  {
                    "id": "5ce3cda60c19fc0d4e9ae7cd",                //仓位id
                    "symbol": "XBTUSDM",                              //合约symbol
                    "autoDeposit": true,                             //是否自动追加保证金
                    "maintMarginReq": 0.005,                         //维持保证金比例
                    "riskLimit": 200,                                //风险限额
                    "realLeverage": 1.06,                            //杠杆倍数
                    "crossMode": false,                              //是否全仓
                    "delevPercentage": 0.1,                          //ADL分位数
                    "openingTimestamp": 1558433191000,               //开仓时间
                    "currentTimestamp": 1558507727807,               //当前时间戳
                    "currentQty": -20,                               //当前仓位
                    "currentCost": 0.00266375,                       //当前总仓位价值
                    "currentComm": 0.00000271,                       //当前总费用
                    "unrealisedCost": 0.00266375,                    //未实现价值
                    "realisedGrossCost": 0,                          //累加已实现毛利价值
                    "realisedCost": 0.00000271,                      //当前累计已实现仓位价值
                    "isOpen": true,                                  //是否开仓
                    "markPrice": 7933.01,                            //标记价格
                    "markValue": 0.00252111,                         //标记价值
                    "posCost": 0.00266375,                           //仓位价值
                    "posCross": 1.2e-7,                              //手动追加的保证金
                    "posInit": 0.00266375,                           //杠杆保证金
                    "posComm": 0.00000392,                           //破产费用
                    "posLoss": 0,                                    //资金费用减少的资金
                    "posMargin": 0.00266779,                         //仓位保证金
                    "posMaint": 0.00001724,                          //维持保证金
                    "maintMargin": 0.00252516,                       //仓位保证金
                    "realisedGrossPnl": 0,                           //累加已实现毛利
                    "realisedPnl": -0.00000253,                      //已实现盈亏
                    "unrealisedPnl": -0.00014264,                    //未实现盈亏
                    "unrealisedPnlPcnt": -0.0535,                    //仓位盈亏率
                    "unrealisedRoePcnt": -0.0535,                    //投资回报率
                    "avgEntryPrice": 7508.22,                        //平均开仓价格
                    "liquidationPrice": 1000000,                     //强平价格
                    "bankruptPrice": 1000000                         //破产价格
                }
            }
            */
            const { data } = await http.get('/api/v1/position', {
                symbol: this.symbol,
            });
            result = data;
        } catch (e) {
            log('get position error', this.symbol, e);
        }
        return result;
    }
}

export default Position;