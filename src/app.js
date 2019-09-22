

// const Koa = require('koa');
// const app = new Koa();

import _ from 'lodash';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import httpIns from './lib/http';
import Datafeed from './lib/datafeed';


async function  main() {
    const app = new Koa();
    const datafeed = new Datafeed();

    app.use(bodyParser);
    app.listen(8090);

    // TODO get from .env
    // 你的账号相关的数据
    httpIns.setSignatureConfig({
        // key: '5d83a5f489fc844d2098958d',
        // secret: 'c64e4866-7b15-45d3-a5c8-8183cf1d4341',
        // passphrase: '',
    })

    datafeed.connectSocket();
    datafeed.onClose(() => {
        console.log('ws closed, status ', datafeed.trustConnected);
    });

    const listenId = datafeed.subscribe('/contractMarket/ticker:XBTUSDM', (message) => {
        console.log(message.data);
    });

    _.delay(() => {
        // test
        console.log('unsubscribe test');
        datafeed.unsubscribe('/contractMarket/ticker:XBTUSDM', listenId);
    }, 20000);


    // const result = await httpIns.get('/api/v1/accounts')
    console.log(2)

    // console.log(result)
}

main()


