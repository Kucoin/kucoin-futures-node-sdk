

// const Koa = require('koa');
// const app = new Koa();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import httpIns from './lib/http';

import Strategy from './lib/strategy';
// import http from 'http';
// import socket from 'socket.io';
// import request from 'request'

// const io = require('socket.io')(server);

async function  main() {
    const app = new Koa();
    const strategy = new Strategy();
    // const server = http.Server(app.callback());
    // const io = socket(server);

    app.use(bodyParser);
    app.listen(8090);
    httpIns.setSignatureConfig({
        // key: '5d83a5f489fc844d2098958d',
        // secret: 'c64e4866-7b15-45d3-a5c8-8183cf1d4341',
        // passphrase: '2223456',
    })

    strategy.connectSocket();

    // const result = await httpIns.get('/api/v1/accounts')
    console.log(2)

    // console.log(result)
}

main()


