/**
 * An example sdk level2 test
 */
// default is sandbox if _USE_KUMEX_ONLINE_ is false or not set
global._USE_KUMEX_ONLINE_ = true;

// set env configure
const { setEnv, getEnv } = require('../sdk/lib/env');
console.log('set env', setEnv);
setEnv({
	log: {
		writeFile: true,
        stdout: false,
        test: 123,
	},
});
console.log('get env', getEnv());

// require deps
const _ = require('lodash');
const logUpdate = require('log-update');
const http = require('../sdk/lib/http');
const Level2 = require('../sdk/com/level2');

const SYMBOL = 'XBTUSDM';

async function main() {
    // set account api keys
    http.setSignatureConfig(getEnv());

    const l2 = new Level2(SYMBOL);
    l2.listen();

    const interval = setInterval(async () => {
        // read orderbook
        const orderbook = l2.getOrderBook(5);
    
        // show Level2
        let asksStr = '';
        _.eachRight(orderbook.asks, ([price, size]) => {
            asksStr += `${price} -> ${size}\n`;
        });

        let bidsStr = '';
        _.each(orderbook.bids, ([price, size]) => {
            bidsStr += `${price} -> ${size}\n`;
        });

        logUpdate.clear();
        logUpdate(`------------------------\n` +
            `l2 ${orderbook.dirty ? 'Dirty Data' : 'Trust Data'}\n` +
            `l2 seq:  ${orderbook.sequence}\n` +
            `ping:    ${orderbook.ping} (ms)\n` +
            `------------------------\n` +
            `${asksStr}----------sep-----------\n` +
            `${bidsStr}------------------------`
        );
    }, 200);
}

main();
