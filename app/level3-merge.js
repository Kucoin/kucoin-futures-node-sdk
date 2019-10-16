/**
 * An example level3 test
 */
import _ from 'lodash';
import logUpdate from 'log-update';
import http from '../src/lib/http';
import Level3 from '../src/com/level3';
import { getEnv } from '../src/lib/env';

const SYMBOL = 'XBTUSDM';

async function main() {
    // set account api keys
    http.setSignatureConfig(getEnv());

    const l3 = new Level3(SYMBOL);
    l3.listen();

    const interval = setInterval(async () => {
        // read orderbook
        const orderbook = l3.getOrderBook(5);
    
        // show Level3
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
            `l3 ${orderbook.dirty ? 'Dirty Data' : 'Trust Data'}\n` +
            `l3 seq:  ${orderbook.sequence}\n` +
            `ping:    ${orderbook.ping} (ms)\n` +
            `------------------------\n` +
            `${asksStr}----------sep-----------\n` +
            `${bidsStr}------------------------`
        );
    }, 200);
}

main();
