
import http from '../lib/http';
import log from '../lib/log';

class Fee {
    symbol;

    constructor(symbol) {
        this.symbol = symbol;
    }

    getFundingHistory = async (params = {}) => {
        // GET /api/v1/funding-history
        let result = false;

        try {
            /*
            data: {
                "dataList": [
                    {
                        "id": 36275152660006,                //id
                        "symbol": "XBTUSDM",                  //合约symbol
                        "timePoint": 1557918000000,          //时间点(毫秒)
                        "fundingRate": 0.000013,             //资金费率
                        "markPrice": 8058.27,                //标记价格
                        "positionQty": 10,                   //结算时的仓位数
                        "positionCost": -0.001241,           //结算时的仓位价值
                        "funding": -0.00000464               //结算的资金费用，正数表示收入；负数表示支出
                    },
                    {
                        "id": 36275152660004,
                        "symbol": "XBTUSDM",
                        "timePoint": 1557914400000,
                        "fundingRate": 0.00375,
                        "markPrice": 8079.65,
                        "positionQty": 10,
                        "positionCost": -0.0012377,
                        "funding": -0.00000465
                    },
                    {
                        "id": 36275152660002,
                        "symbol": "XBTUSDM",
                        "timePoint": 1557910800000,
                        "fundingRate": 0.00375,
                        "markPrice": 7889.03,
                        "positionQty": 10,
                        "positionCost": -0.0012676,
                        "funding": -0.00000476
                    }
                ],
                "hasMore": true  // 是否还有下一页
            }
            参数	数据类型	含义
            symbol	String	合约symbol

            startAt	long	[可选] 开始时间（毫秒）
            endAt	long	[可选] 截止时间（毫秒）
            reverse	boolean	[可选] 是否逆序查询， true 或者 false，默认为true
            offset	long	[可选] 起始偏移量，一般使用上个请求最后一条返回结果的唯一属性，默认返回第一页
            forward	boolean	[可选] 是否前向查询，true或者false，默认为true
            maxCount	int	[可选] 最大记录条数，默认为10
            */
            const { data } = await http.get('/api/v1/funding-history', {
                ...params,
                symbol: this.symbol,
            });
            result = data;
        } catch (e) {
            log('get funding-history error', e);
        }
        return result;
    }
}

export default Fee;