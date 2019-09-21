

// const Koa = require('koa');
// const app = new Koa();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import httpIns from './lib/http';

import Strategy from './lib/strategy';


async function  main() {
    const app = new Koa();
    const strategy = new Strategy();

    app.use(bodyParser);
    app.listen(8090);
    // 你的账号相关的数据
    httpIns.setSignatureConfig({
        // key: '5d83a5f489fc844d2098958d',
        // secret: 'c64e4866-7b15-45d3-a5c8-8183cf1d4341',
        // passphrase: '',
    })

    strategy.connectSocket();

    // const result = await httpIns.get('/api/v1/accounts')
    console.log(2)

    // console.log(result)
}

main()

