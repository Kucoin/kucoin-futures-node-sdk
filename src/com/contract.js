// https://kitchen.kumex.top/web-front/contracts/XBTUSDM


import http from '../lib/http';
import log from '../lib/log';

const IS_PRODUCT = process.env.PRODUCTION === 'true';
const baseUrl = IS_PRODUCT ? 'https://kitchen.kumex.top' : 'https://kitchen-sdb.kumex.com';

class Contract {
    symbol;

    constructor(symbol) {
        this.symbol = symbol;
    }

    getOverview = async () => {
        let result = false;

        try {
            /*
            {
                "success": true,
                "code": "200",
                "msg": "success",
                "retry": false,
                "data": {
                    "symbol": "XBTUSDM",
                    "rootSymbol": "XBT",
                    "type": "FFWCSX",
                    "firstOpenDate": 1552638575000,
                    "expireDate": null,
                    "settleDate": null,
                    "baseCurrency": "XBT",
                    "quoteCurrency": "USD",
                    "settleCurrency": "XBT",
                    "maxOrderQty": 1000000,
                    "maxPrice": 1000000.0000000000,
                    "lotSize": 1,
                    "tickSize": 1.0,
                    "multiplier": -1.0,
                    "initialMargin": 0.01,
                    "maintainMargin": 0.005,
                    "maxRiskLimit": 200,
                    "minRiskLimit": 200,
                    "riskStep": 100,
                    "makerFeeRate": -2.5E-4,
                    "takerFeeRate": 6.0E-4,
                    "takerFixFee": 0.0000000000,
                    "makerFixFee": 0.0000000000,
                    "settlementFee": 0.0,
                    "isDeleverage": true,
                    "isQuanto": false,
                    "isInverse": true,
                    "markMethod": "FairPrice",
                    "fairMethod": "FundingRate",
                    "fundingBaseSymbol": ".XBTINT8H",
                    "fundingQuoteSymbol": ".USDINT8H",
                    "fundingRateSymbol": ".XBTUSDMFPI8H",
                    "indexSymbol": ".BXBT",
                    "status": "Open",
                    "fundingFeeRate": 0.000100, // 资金费率
                    "predictedFundingFeeRate": 0.000100, // 预测资金费率
                    "openInterest": "2747590",
                    "turnoverOf24h": 570.10756506,
                    "volumeOf24h": 4651337.00000000,
                    "markPrice": 8112.62,
                    "indexPrice": 8111.96,
                    "lastTradePrice": 8102.0000000000,
                    "nextFundingRateTime": 23531767 // 距离下一个资金费用结算时间点的剩余时间
                }
            }
            */
            const { data } = await http._request({
                url: `${baseUrl}/web-front/contracts/${this.symbol}`,
                method: 'GET',
            });
            result = data;
        } catch (e) {
            log('get contract overview error', e);
        }
        return result;
    }
}

export default Contract;