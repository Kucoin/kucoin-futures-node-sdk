
import http from '../lib/http';
import log from '../lib/log';
import { genUUID } from '../lib/utils';

class Order {
    symbol;
    leverage;

    constructor(symbol, leverage) {
        this.symbol = symbol;
        this.leverage = leverage;
    }

    static LIMIT_SELECT = {
        timeInForce: { GTC: 'GTC', IOC: 'IOC' },
        postOnly: { YES: true, NO: false },
        hidden: { YES: true, NO: false },
        iceberg: { YES: true, NO: false },
    }

    // limit order ---> success ---> clOid
    limitOrder = async (price, size, side, extraProps = {}) => {
        /*
        price	String	限价单的价格
        size	Integer	订单数量。必须是一个正数。

        extraProps (include typeProps):
            timeInForce	String	[可选] 订单时效策略，包括GTC、IOC（默认为GTC）。
            postOnly	boolean	[可选] 只挂单的标识。选择postOnly，不允许选择hidden和iceberg。当订单时效为IOC策略时，该参数无效。
            hidden	boolean	[可选] 订单不会在买卖盘中展示。选择hidden，不允许选择postOnly。
            iceberg	boolean	[可选] 仅设置可见的部分会显示在买卖盘中。选择iceberg，不允许选择postOnly。
            visibleSize	Integer	[可选] 冰山单最大可展示的数量。
        typeProps:
            remark	String	[可选] 下单备注，字符长度不能超过100 个字符（UTF-8）。
            stop	String	[可选] 触发价格的两种类型。下跌至某个价格（down），或上涨至某个价格（up）。设置后，就必须设置stopPrice和stopPriceType 参数。
            stopPriceType	String	[可选] 止损单触发价类型，包括TP、IP和MP， 只要设置stop参数，就必须设置此属性。
            stopPrice	String	[可选] 只要设置stop参数，就必须设置此属性。
            stp	String	[可选] 自成交保护，分为 CN、CO、CB和 DC 四种策略
            reduceOnly	boolean	[可选] 只减仓标记, 默认值是 false
            closeOrder	boolean	[可选] 平仓单标记, 默认值是 false
            forceHold	boolean	[可选] 强制冻结标记（减仓同样适用）,可将订单留在买卖盘中而不受仓位变化的影响。默认值是 false
        */
        if (typeof price !== 'string' ||
            typeof size !== 'number' ||
            !(size > 0)
        ) {
            log('Invalid price or size', price, size);
            return false;
        }

        return await this._order('limit', side, {
            ...extraProps,
            price,
            size,
        });
    }

    // market order ---> success ---> clOid
    marketOrder = async (size, side, extraProps = {}) => {
        /*
        size	Integer	[可选] 下单数量
        extraProps (include typeProps):
        typeProps:
            remark	String	[可选] 下单备注，字符长度不能超过100 个字符（UTF-8）。
            stop	String	[可选] 触发价格的两种类型。下跌至某个价格（down），或上涨至某个价格（up）。设置后，就必须设置stopPrice和stopPriceType 参数。
            stopPriceType	String	[可选] 止损单触发价类型，包括TP、IP和MP， 只要设置stop参数，就必须设置此属性。
            stopPrice	String	[可选] 只要设置stop参数，就必须设置此属性。
            stp	String	[可选] 自成交保护，分为 CN、CO、CB和 DC 四种策略
            reduceOnly	boolean	[可选] 只减仓标记, 默认值是 false
            closeOrder	boolean	[可选] 平仓单标记, 默认值是 false
            forceHold	boolean	[可选] 强制冻结标记（减仓同样适用）,可将订单留在买卖盘中而不受仓位变化的影响。默认值是 false
        */
        if (typeof size !== 'number' ||
            !(size > 0)
        ) {
            log('Invalid size', size);
            return false;
        }
        
        return await this._order('market', side, {
            ...extraProps,
            size,
        });
    }

    // cancle single order by id
    cancleOrderById = async (orderServId) => {
        let result = false;

        if (!orderServId) {
            log('Invalid orderId to cancle', orderServId);
            return result;
        }
        try {
            // {
            //     "code": "200000",
            //     "data": {
            //     "cancelledOrderIds": [
            //         "5bd6e9286d99522a52e458de"
            //     ]
            //     }
            // }
            const { data: { cancelledOrderIds } } = await http.del(`/api/v1/orders/${orderServId}`);
            result = cancelledOrderIds;
        } catch (e) {
            log('cancle order error', e);
        }
        return result;
    }

    cancleAllOrders = async () => {
        // DELETE /api/v1/orders?symbol=XBTUSDM
        let result = false;

        try {
            // {
            //     "code": "200000",
            //     "data": {
            //     "cancelledOrderIds": [
            //         "5bd6e9286d99522a52e458de"
            //     ]
            //     }
            // }
            const { data: { cancelledOrderIds } } = await http.del('/api/v1/orders', { symbol: this.symbol });
            result = cancelledOrderIds;
        } catch (e) {
            log('cancle all order error', e);
        }
        return result;
    }

    cancleAllStopOrders = async () => {
        // DELETE /api/v1/stopOrders?symbol=XBTUSDM
        let result = false;

        try {
            // {
            //     "code": "200000",
            //     "data": {
            //     "cancelledOrderIds": [
            //         "5bd6e9286d99522a52e458de"
            //     ]
            //     }
            // }
            const { data: { cancelledOrderIds } } = await http.del('/api/v1/stopOrders', { symbol: this.symbol });
            result = cancelledOrderIds;
        } catch (e) {
            log('cancle all stop order error', e);
        }
        return result;
    }

    getActiveOrders = async () => {
        // GET /api/v1/orders?status=active
        let result = false;

        try {
            /*
            {
                "code": "200000",
                "data": {
                    "currentPage": 1,
                    "pageSize": 100,
                    "totalNum": 1000,
                    "totalPage": 10,
                    "items": [
                        {
                            "id": "5cdfc138b21023a909e5ad55", //订单编号
                            "symbol": "XBTUSDM",  //合约编号
                            "type": "limit",   //类型, 市价单或限价单
                            "side": "buy",  //买卖方向
                            "price": "3600",  //下单价格
                            "size": 20000,  //数量
                            "value": "56.1167227833",  //订单价值
                            "dealValue": "0",  //已经成交订单价值
                            "dealSize": 0,  //已经成交订单数量
                            "stp": "",  //stp 类型
                            "stop": "",  //止损订单类型
                            "stopPriceType": "",  //止损订单触发价格类型
                            "stopTriggered": false,  //止损订单是否触发标志
                            "stopPrice": null,  //止损订单触发价格
                            "timeInForce": "GTC",  //timeInForce类型
                            "postOnly": false,  //postOnly标志
                            "hidden": false,  //隐藏单标志
                            "iceberg": false,  //冰山单标志
                            "visibleSize": null,  //冰山单可见数量
                            "leverage": "20",  //杠杆倍数
                            "forceHold": false,  //强制冻结单标志
                            "closeOrder": false, //平仓单标志
                            "closeOnly": false,  //只减仓单标志
                            "clientOid": "5ce24c16b210233c36ee321d",  //客户订单编号
                            "remark": null,  //注解
                            "isActive": true,  //未完成订单标志
                            "cancelExist": false,  //订单存在取消数量标志
                            "createdAt": 1558167872000  //创建时间
                            }
                        ]
                    }  
                }
            */
            const { data } = await http.get('/api/v1/orders', {
                symbol: this.symbol,
                status: 'active',
            });
            result = data;
        } catch (e) {
            log('get active orders error', e);
        }
        return result;
    }

    // -----> private
    _order = async (type, side, typeProps = {}) => {
        /*
        clientOid	String	唯一的订单ID，可用于识别订单。如：UUID 只能包含数字、字母、下划线（_）或 分隔线（-）
        side	String	buy 或 sell
        symbol	String	有效合约代码。如：XBTUSDM
        leverage	String	下单杠杆倍数
        type	String	[可选] 订单类型，包括limit或market,默认limit。

        typeProps:
            remark	String	[可选] 下单备注，字符长度不能超过100 个字符（UTF-8）。
            stop	String	[可选] 触发价格的两种类型。下跌至某个价格（down），或上涨至某个价格（up）。设置后，就必须设置stopPrice和stopPriceType 参数。
            stopPriceType	String	[可选] 止损单触发价类型，包括TP、IP和MP， 只要设置stop参数，就必须设置此属性。
            stopPrice	String	[可选] 只要设置stop参数，就必须设置此属性。
            stp	String	[可选] 自成交保护，分为 CN、CO、CB和 DC 四种策略
            reduceOnly	boolean	[可选] 只减仓标记, 默认值是 false
            closeOrder	boolean	[可选] 平仓单标记, 默认值是 false
            forceHold	boolean	[可选] 强制冻结标记（减仓同样适用）,可将订单留在买卖盘中而不受仓位变化的影响。默认值是 false
        */
        let result = false;
        try {
            const clientOid = genUUID();

            const { data: { orderId } } = await http.post('/api/v1/orders', {
                ...typeProps,
                clientOid,
                side,
                symbol: this.symbol,
                leverage: this.leverage,
                type,
            });

            result = {
                srOid: orderId,
                clOid: clientOid,
            };
        } catch (e) {
            log('order error', e);
        }
        return result;
    }

}

export default Order;