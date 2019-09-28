/**
 * 事例应用
 */
import _ from 'lodash';
// import Koa from 'koa';
// import bodyParser from 'koa-bodyparser';
import logUpdate from 'log-update';
import http from '../src/lib/http';
import Datafeed from '../src/lib/datafeed';
// import log from '../src/lib/log';
// import Ticker from '../src/com/ticker';
import Level2 from '../src/com/level2';
import env from '../.env';

const SYMBOL = 'XBTUSDM';

async function main() {
    // const app = new Koa();
    // app.use(bodyParser);
    // app.listen(8090);

    // set account api keys
    http.setSignatureConfig(env);

    const datafeed = new Datafeed();

    // const ticker = new Ticker(SYMBOL, datafeed);
    // ticker.listen();

    const l2 = new Level2(SYMBOL, datafeed);
    l2.listen();

    setInterval(() => {
        const orderbook = l2.getOrderBook(11);
        // const tickerWS = ticker.getSnapshot();
        // const currentTicker = tickerWS.data;

        let asksStr = '';
        _.each(orderbook.asks, ([price, size]) => {
            asksStr += `${price} -> ${size} \n`;
        });

        let bidsStr = '';
        _.each(orderbook.bids, ([price, size]) => {
            bidsStr += `${price} -> ${size} \n`;
        });

        // ticker ${tickerWS.dirty ? 'Dirty Data' : 'Trust Data'}
        // ticker:  ${currentTicker.price} -> ${currentTicker.size}
        // bestBid: ${currentTicker.bestBidPrice},${currentTicker.bestBidSize} 
        // bestAsk: ${currentTicker.bestAskPrice},${currentTicker.bestAskSize}

        logUpdate.clear();
        logUpdate(`------------------------
l2 ${orderbook.dirty ? 'Dirty Data' : 'Trust Data'}
l2 seq:  ${orderbook.sequence}
ping:    ${orderbook.ping} (ms)
------------------------
${asksStr}----------sep-----------
${bidsStr}------------------------
`);

    }, 200);
}

main();
