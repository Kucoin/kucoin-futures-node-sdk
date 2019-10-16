/**
 * An example level2 test
 */
import _ from 'lodash';
import logUpdate from 'log-update';
import http from '../src/lib/http';
import Level2 from '../src/com/level2';
import { getEnv } from '../src/lib/env';

console.log(1, getEnv());
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
