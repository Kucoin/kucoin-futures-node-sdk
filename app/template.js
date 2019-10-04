/**
 * An example strategy template
 */
import _ from 'lodash';
// import Koa from 'koa';
// import bodyParser from 'koa-bodyparser';
import logUpdate from 'log-update';
import http from '../src/lib/http';
import Datafeed from '../src/lib/datafeed';
import { mergeDepth, targetTypesMap } from '../src/lib/utils';
import log from '../src/lib/log';
// import Ticker from '../src/com/ticker';
import Level2 from '../src/com/level2';
import Order from '../src/com/order';
// import Position from '../src/com/position';
// import Account from '../src/com/account';
// import Fee from '../src/com/fee';
// import Time from '../src/com/time';
// import Contract from '../src/com/contract';
import env from '../.env';

const SYMBOL = 'XBTUSDM';

async function main() {
    // const app = new Koa();
    // app.use(bodyParser);
    // app.listen(8090);

    // set account api keys
    http.setSignatureConfig(env);

    // const account = new Account();
    // const position = new Position(SYMBOL);

    // const acc = await account.getOverview();
    // log('acc', acc);
    // const pos = await position.getPosition();
    // log('pos', pos);
    // return;

    // const time = new Time();
    // const fee = new Fee(SYMBOL);

    // const ts = await time.getTimestamp();
    // log('ts', ts);
    // const fees = await fee.getFundingHistory();
    // log('fees', fees);
    // return;
    
    // const ct = new Contract(SYMBOL);
    // const ctd = await ct.getOverview();
    // log('ctd', ctd);
    // return;

    // use single private datafeed
    const datafeed = new Datafeed(true);

    // const ticker = new Ticker(SYMBOL, datafeed);
    // ticker.listen();

    const l2 = new Level2(SYMBOL, datafeed);
    l2.listen();

    const order = new Order(SYMBOL, 5);
    let orderCommitting = false;
    const orderTransaction = async (priceSell, priceBuy) => {
        if (orderCommitting) {
            log('orderTransaction orderCommitting');
            return;
        }
        orderCommitting = true;

        log(`orderTransaction`, priceSell, priceBuy);
        const size = 10;
        const sellOrderSuccess = await order.limitOrder(priceSell, size, 'sell', { postOnly: true });
        const buyOrderSuccess = await order.limitOrder(priceBuy, size, 'buy', { postOnly: true });

        if (!sellOrderSuccess || !buyOrderSuccess) {
            const r = await order.cancleAllOrders();
            log('cancel all orders', sellOrderSuccess, buyOrderSuccess, r);
        }

        orderCommitting = false;
    };

    const interval = setInterval(async () => {
        // read orderbook
        const orderbook = l2.getOrderBook(5);
        // get active orders
        const orderData = await order.getActiveOrders();
        
        // Ticker
        // const tickerWS = ticker.getSnapshot();
        // const currentTicker = tickerWS.data;
        // ticker ${tickerWS.dirty ? 'Dirty Data' : 'Trust Data'}
        // ticker:  ${currentTicker.price} -> ${currentTicker.size}
        // bestBid: ${currentTicker.bestBidPrice},${currentTicker.bestBidSize} 
        // bestAsk: ${currentTicker.bestAskPrice},${currentTicker.bestAskSize}

        // template strategy
        const mapOrderToL2 = { asks: {}, bids: {} };
        if (orderbook.dirty === false) {
            if (orderData.totalNum > 0) {
                _.each(orderData.items, ({ symbol, price, side, size, type }) => {
                    if (symbol === SYMBOL) {
                        const targetSide = targetTypesMap[side];
                        if (_.indexOf(['asks', 'bids'], targetSide) > -1) {
                            mapOrderToL2[targetSide][mergeDepth(price, targetSide)] = [size, type];
                        }
                    }
                });
            } else
            if (orderData.totalNum === 0) {
                const asksFirst = orderbook.asks[0];
                const bidsFirst = orderbook.bids[0];
                if (asksFirst && bidsFirst) {
                    if (asksFirst[0] - bidsFirst[0] > 5) {
                        orderTransaction(asksFirst[0], bidsFirst[0]);
                    }
                }
            }
        }

        // show Level2
        let asksStr = '';
        _.eachRight(orderbook.asks, ([price, size]) => {
            const orderFind = mapOrderToL2.asks[price];
            let str = '';
            if (orderFind) {
                const [size, type] = orderFind;
                str = `@${size}, ${type}`;
            }
            asksStr += `${price} -> ${size} ${str}\n`;
        });

        let bidsStr = '';
        _.each(orderbook.bids, ([price, size]) => {
            const orderFind = mapOrderToL2.bids[price];
            let str = '';
            if (orderFind) {
                const [size, type] = orderFind;
                str = `@${size}, ${type}`;
            }
            bidsStr += `${price} -> ${size} ${str}\n`;
        });

        logUpdate.clear();
        logUpdate(`------------------------\n` +
            `l2 ${orderbook.dirty ? 'Dirty Data' : 'Trust Data'}\n` +
            `l2 seq:  ${orderbook.sequence}\n` +
            `ping:    ${orderbook.ping} (ms)\n` +
            `order:   ${orderData.totalNum} (count)\n` +
            `------------------------\n` +
            `${asksStr}----------sep-----------\n` +
            `${bidsStr}------------------------`
        );
    }, 400);
}

main();
