import _ from 'lodash';
import Datafeed from '../lib/datafeed';
import http from '../lib/http';
import log from '../lib/log';
import delay from '../lib/delay';
import {
    mergeDepth,
    checkContinue,
    mapArr,
    arrMap,
    targetTypesMap,
} from '../lib/utils';

const changeTypes = ['asks', 'bids'];

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

    constructor(symbol, datafeed) {
        this.symbol = symbol;

        if (datafeed instanceof Datafeed) {
            this.datafeed = datafeed;
        } else {
            this.datafeed = new Datafeed();
        }
    }

    bufferMessage = (message) => {
        const { sequence, change } = message || {};
        if (sequence && change) {
            const [price, type, size] = change.split(',');
            const seq = this.fullSnapshot.sequence;
            // log('check', sequence, seq);
            if (this.fullSnapshot.dirty === false && sequence === seq + 1) {
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
                    log('invalid type', type);
                }
            } else
            if (sequence > seq) {
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
            log('rebuilding dirty level2, return',
                this.fullSnapshot.sequence,
                this.buffer.length && this.buffer[this.buffer.length - 1][0],
            );
            return;
        }
        log('build dirty level2');
        this._rebuilding = true;
        this.fullSnapshot.dirty = true;

        await delay(6100);
        const fetchSuccess = await this.fetch();
        const seq = this.fullSnapshot.sequence;

        if (fetchSuccess && this.datafeed.trustConnected) {
            const bufferArr = this.getFilteredBuffer(seq);

            // if (bufferArr.length === 0 && this.buffer.length > 0) {
            //     console.log('snapshot before', seq, this.buffer[this.buffer.length - 1][0]);
            // }

            if (bufferArr.length > 0 ||
                (bufferArr.length === 0 && this.buffer.length === 0) ||
                (bufferArr.length === 0 && (seq === this.buffer[this.buffer.length - 1][0]))
            ) {
                const continu = checkContinue(bufferArr, seq);
                if (continu) {
                    log('seq & len', this.fullSnapshot.sequence, bufferArr.length, this.buffer.length);
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
                            log('invalid type', type);
                        }
                    });
                    this.fullSnapshot.dirty = false;
                    this.buffer = [];
                    log('level2 checked');
                } else {
                    log('level2 buffer is not continue with snapshot');
                }
            }
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
        let fetchSuccess = false;
        try {
            const result = await http.get(`/api/v1/level2/snapshot?symbol=${this.symbol}`);
            if (result.code === '200000' &&
                result.data &&
                result.data.symbol === this.symbol
            ) {
                const { sequence, asks, bids } = result.data;

                this.fullSnapshot.dirty = true;
                this.fullSnapshot.sequence = sequence;
                this.fullSnapshot.asks = mapArr(asks, (str) => mergeDepth(str, 'asks'));
                this.fullSnapshot.bids = mapArr(bids, (str) => mergeDepth(str, 'bids'));
                fetchSuccess = true;
            }
        } catch (e) {
            log('fetch level2 error', e);
        }
        return fetchSuccess;
    }

    /** public */
    listen = () => {
        this.datafeed.connectSocket();
        this.datafeed.onClose(() => {
            log('ws closed, status ', this.datafeed.trustConnected);
            this.rebuild();
        });

        const topic = `/contractMarket/level2:${this.symbol}`;
        this.datafeed.subscribe(topic, (message) => {
            if (message.topic === topic) {
                // log(message.data);
                this.bufferMessage(message.data);
            }
        });
        this.rebuild();
    }

    getOrderBook = (limit = 10) => {
        const dirty = this.fullSnapshot.dirty;
        const sequence = this.fullSnapshot.sequence;
        const asks = arrMap(this.fullSnapshot.asks, 'asc').slice(0, limit);
        const bids = arrMap(this.fullSnapshot.bids, 'desc').slice(0, limit);
        const ping = this.datafeed.ping;

        return {
            dirty,
            sequence,
            asks,
            bids,
            ping,
        };
    }
}

export default Level2;