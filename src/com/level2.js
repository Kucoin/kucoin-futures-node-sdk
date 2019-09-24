import _ from 'lodash';
import Datafeed from '../lib/datafeed';
import http from '../lib/http';
import log from '../lib/log';
import delay from '../lib/delay';


const changeTypes = ['asks', 'bids'];
const targetTypesMap = {
    sell: 'asks',
    buy: 'bids',
};

const mergeDepth = (price, type, depth = 1) => {
    if (type === 'asks') {
        price = Math.ceil(price / depth) * depth;
    } else {
        price = Math.floor(price / depth) * depth;
    }
    return price;
};

const checkContinue = (arrBuffer = [], seq) => {
    if (arrBuffer.length) {
        if (arrBuffer[0][0] !== seq +1) {
            return false;
        }
        
        for (let i = 0; i < arrBuffer.length; i++) {
            if (arrBuffer[i + 1] && arrBuffer[i + 1][0] !== arrBuffer[i][0] + 1) {
                return false;
            }
        }
    }
    return true;
};

const mapArr = (arr = [], parseKey = (str) => str) => {
    const res = {};
    for (let i = 0; i< arr.length; i++) {
        const item = arr[i];
        res[parseKey(item[0])] = item[1];
    }
    return res;
};

const arrMap = (map = {}, order = 'asc') => {
    const res = [];
    _.each(map, (size, price) => {
        res.push([price, size]);
    });
    res.sort((a, b) => {
        if (order === 'desc') {
            return b[0] - a[0];
        } else {
            return a[0] - b[0];
        }
    });
    return res;
};

class Level2 {
    datafeed;
    symbol;
    buffer = [];
    fullSnapshot = {
        dirty: true,
        sequence: 0,
        asks: {},
        bids: {},
    };
    debug = false;

    constructor(symbol, datafeed) {
        this.symbol = symbol;

        if (datafeed instanceof Datafeed) {
            this.datafeed = datafeed;
        } else {
            this.datafeed = new Datafeed();
            // this.datafeed.debug = true;
        }
    }

    bufferMessage = (message) => {
        const { sequence, change } = message || {};
        if (sequence && change) {
            const [price, type, size] = change.split(',');

            // this.debug && log('check', sequence, this.fullSnapshot.sequence);
            if (sequence === this.fullSnapshot.sequence + 1) {
                // update
                const targetType = targetTypesMap[type];
                if (_.indexOf(changeTypes, targetType) > -1) {
                    const targetPrice = mergeDepth(price, targetType);
                    if (size == 0) {
                        delete this.fullSnapshot[targetType][targetPrice];
                    } else {
                        this.fullSnapshot[targetType][targetPrice] = size;
                    }
                    this.fullSnapshot.sequence = sequence;
                } else {
                    this.debug && log('invalid type', type);
                }
            } else {
                this.buffer.push([sequence, price, type, size]);
                // rebuild
                this.rebuild();
            }
        }
    }

    getFilteredBuffer = (seq) => {
        return this.buffer.filter((item) => {
            return item[0] > seq;
        });
    }

    _rebuilding = false;
    rebuild = async () => {
        if (this._rebuilding) {
            this.debug && log('rebuilding dirty level2, return');
            return;
        }
        this.debug && log('build dirty level2');
        this._rebuilding = true;
        this.fullSnapshot.dirty = true;

        await delay(3000);

        await this.fetch();
        const seq = this.fullSnapshot.sequence;

        const bufferArr = this.getFilteredBuffer(seq);
        const continu = checkContinue(bufferArr, seq);
        if (continu) {
            _.each(bufferArr, (item) => {
                const [sequence, price, type, size] = item;
                const targetType = targetTypesMap[type];
                if (_.indexOf(changeTypes, targetType) > -1) {
                    const targetPrice = mergeDepth(price, targetType);
                    if (size == 0) {
                        delete this.fullSnapshot[targetType][targetPrice];
                    } else {
                        this.fullSnapshot[targetType][targetPrice] = size;
                    }
                    this.fullSnapshot.sequence = sequence;
                } else {
                    this.debug && log('invalid type', type);
                }
            });
            this.fullSnapshot.dirty = false;
            this.buffer = [];
            this.debug && log(this.fullSnapshot.sequence, bufferArr);
        } else {
            this.debug && log('level2 buffer is not continue with snapshot');
        }
        this._rebuilding = false;
    }

    fetch = async () => {
        /*
        {
            code: '200000',
            data: {
                symbol: 'XBTUSDM',
                sequence: 75017803,
                asks: [],
                bids: [],
            }
        }
        */
        try {
            const result = await http.get(`/api/v1/level2/snapshot?symbol=${this.symbol}`);
            if (result.code === '200000' &&
                result.data &&
                result.data.symbol === this.symbol
            ) {
                // console.log(result.data);
                const { sequence, asks, bids } = result.data;

                this.fullSnapshot.dirty = true;
                this.fullSnapshot.sequence = sequence;
                this.fullSnapshot.asks = mapArr(asks, (str) => mergeDepth(str, 'asks'));
                this.fullSnapshot.bids = mapArr(bids, (str) => mergeDepth(str, 'bids'));
            }
        } catch (e) {
            this.debug && log('fetch level2 error', e);
        }
    }

    /** public */
    listen = () => {
        this.datafeed.connectSocket();
        this.datafeed.onClose(() => {
            this.debug && log('ws closed, status ', this.datafeed.trustConnected);
            this.rebuild();
        });

        const topic = `/contractMarket/level2:${this.symbol}`;
        this.datafeed.subscribe(topic, (message) => {
            if (message.topic === topic) {
                // this.debug && log(message.data);
                this.bufferMessage(message.data);
            }
        });
        this.rebuild();
    }

    getOrderBook = (limit = 10) => {
        const dirty = this.fullSnapshot.dirty;
        const asks = arrMap(this.fullSnapshot.asks, 'desc').slice(-1 * limit);
        const bids = arrMap(this.fullSnapshot.bids, 'desc').slice(0, limit);

        return {
            dirty,
            asks,
            bids,
        };
    }
}

export default Level2;