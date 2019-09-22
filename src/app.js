

// const Koa = require('koa');
// const app = new Koa();

import _ from 'lodash';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import httpIns from './lib/http';
import Level2 from './com/level2';
import Ticker from './com/ticker';
import env from './.env';

async function  main() {
    const app = new Koa();

    app.use(bodyParser);
    app.listen(8090);

    // 你的账号相关的数据
    httpIns.setSignatureConfig(env)
    // const result = await httpIns.get('/api/v1/accounts')
    // console.log(2)

    // const ticker = new Ticker('XBTUSDM');
    // ticker.listen();
    
    // setInterval(() => {
    //     const currentTicker = ticker.getSnapshot();
    //     console.log(currentTicker);
    // }, 1000);


    const l2 = new Level2('XBTUSDM');
    l2.listen();

}

main()


