

// const Koa = require('koa');
// const app = new Koa();

import _ from 'lodash';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logUpdate from 'log-update';
import httpIns from './lib/http';

import Level2 from './com/level2';
import Ticker from './com/ticker';
import env from '../.env';

async function main() {
    const app = new Koa();

    app.use(bodyParser);
    app.listen(8090);

    // 你的账号相关的数据
    httpIns.setSignatureConfig(env)

    // const ticker = new Ticker('XBTUSDM');
    // ticker.listen();
    // setInterval(() => {
    //     const currentTicker = ticker.getSnapshot();
    //     console.log(currentTicker);
    // }, 1000);


    const l2 = new Level2('XBTUSDM');
    // l2.debug = true;
    l2.listen();

    setInterval(() => {
        const orderbook = l2.getOrderBook(11);

        let asksStr = '';
        _.each(orderbook.asks, ([price, size]) => {
            asksStr += `${price} -> ${size} \n`;
        });

        let bidsStr = '';
        _.each(orderbook.bids, ([price, size]) => {
            bidsStr += `${price} -> ${size} \n`;
        });

        logUpdate.clear();
        // console.log(JSON.stringify(orderbook));
        logUpdate(`------------------------
${orderbook.dirty ? '脏数据' : '可用数据'}
------------------------
${asksStr}----------sep-----------
${bidsStr}------------------------
`);
    }, 200);
}

main()


