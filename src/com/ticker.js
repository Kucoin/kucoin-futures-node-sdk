import _ from 'lodash';
import Datafeed from '../lib/datafeed';
import log from '../lib/log';

class Ticker {
    datafeed;
    symbol;
    snapshot = {
        dirty: true,
        data: null,
    };

    constructor(symbol, datafeed) {
        this.symbol = symbol;

        if (datafeed instanceof Datafeed) {
            this.datafeed = datafeed;
        } else {
            this.datafeed = new Datafeed();
        }
    }

    getSnapshot = () => {
        return _.cloneDeep(this.snapshot);
    };

    updateSnapshot = (data) => {
        // { symbol: 'XBTUSDM',
        //     side: 'buy',
        //     size: 100,
        //     price: 10000,
        //     bestBidSize: 9371,
        //     bestBidPrice: '9996.0',
        //     bestAskPrice: '10000.0',
        //     tradeId: '5d8743653c7feb4209084ffa',
        //     ts: 1569145701444522200,
        //     bestAskSize: 32422 }

        this.snapshot = {
            dirty: false,
            data,
        };
    }

    listen = () => {
        this.datafeed.connectSocket();
        this.datafeed.onClose(() => {
            log('ticker ws closed, status ', this.datafeed.trustConnected);
            this.snapshot.dirty = true;
        });

        this.datafeed.subscribe(`/contractMarket/ticker:${this.symbol}`, (message) => {
            if (message.data) {
                this.updateSnapshot(message.data);
            }
        });
    }
}

export default Ticker;