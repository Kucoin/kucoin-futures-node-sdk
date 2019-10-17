import _ from 'lodash';
import Datafeed from '../lib/datafeed';
import http from '../lib/http';
import log from '../lib/log';
import delay from '../lib/delay';
import {
    mergeDepth,
    checkContinue,
    mapl3Arr,
    arrMap,
    arrl3Map,
    targetTypesMap,
} from '../lib/utils';

const changeTypes = ['asks', 'bids'];

class Level3 {
    datafeed;
    symbol;
    buffer = [];
    fullSnapshot = {
        dirty: true,
        sequence: 0,
        asks: {}, // price => orderId => item
        bids: {},
    };
    messageEventCallback;

    constructor(symbol, datafeed) {
        this.symbol = symbol;

        if (datafeed instanceof Datafeed) {
            this.datafeed = datafeed;
        } else {
            this.datafeed = new Datafeed();
        }
    }

    bufferMessage = (message) => {
        const { sequence, type } = message || {};
        if (sequence && type) {
            const seq = this.fullSnapshot.sequence;
            // log('check', sequence, seq);
            if (this.fullSnapshot.dirty === false && sequence === seq + 1) {
                // update
                this.updateFullByMessage(message);
            } else
            if (sequence > seq) {
                this.buffer.push(message);
                // rebuild
                this.rebuild();
            }
        }
    }

    getFilteredBuffer = (seq) => {
        return this.buffer.filter((item) => {
            return item.sequence > seq;
        });
    }

    _rebuilding = false;
    rebuild = async () => {
        if (this._rebuilding) {
            log('rebuilding dirty level3, return',
                this.fullSnapshot.sequence,
                this.buffer.length && this.buffer[this.buffer.length - 1].sequence,
            );
            return;
        }
        log('build dirty level3');
        this._rebuilding = true;
        this.fullSnapshot.dirty = true;

        await delay(6100);
        const fetchSuccess = await this.fetch();
        const seq = this.fullSnapshot.sequence;

        if (fetchSuccess && this.datafeed.trustConnected) {
            const bufferArr = this.getFilteredBuffer(seq);

            // if (bufferArr.length === 0 && this.buffer.length > 0) {
            //     console.log('snapshot before', seq, this.buffer[this.buffer.length - 1].sequence);
            // }

            if (bufferArr.length > 0 ||
                (bufferArr.length === 0 && this.buffer.length === 0) ||
                (bufferArr.length === 0 && (seq === this.buffer[this.buffer.length - 1].sequence))
            ) {
                const continu = checkContinue(bufferArr, seq, 'sequence');
                if (continu) {
                    log('seq & len', this.fullSnapshot.sequence, bufferArr.length, this.buffer.length);
                    _.each(bufferArr, (message) => {
                        // update
                        this.updateFullByMessage(message);
                    });
                    this.fullSnapshot.dirty = false;
                    this.buffer = [];
                    log('level3 checked');
                } else {
                    log('level3 buffer is not continue with snapshot');
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
            const result = await http.get(`/api/v1/level3/snapshot?symbol=${this.symbol}`);
            if (result.code === '200000' &&
                result.data &&
                result.data.symbol === this.symbol
            ) {
                const { sequence, asks, bids } = result.data;

                this.fullSnapshot.dirty = true;
                this.fullSnapshot.sequence = sequence;
                // [下单时间 - 纳秒, 订单号, 价格, 数量, 进入买卖盘时间 - 纳秒]
                this.fullSnapshot.asks = mapl3Arr(asks);
                this.fullSnapshot.bids = mapl3Arr(bids);
                fetchSuccess = true;
            }
        } catch (e) {
            log('fetch level3 error', e);
        }
        return fetchSuccess;
    }

    updateFullByMessage = (message) => {
        const { sequence, type } = message;

        let updated = true;
        switch (type) {
            case 'received':
                /*
                    "symbol": "XBTUSDM",                        // 合约
                    "sequence": 3262786900,                 // 顺序号
                    "type": "received",
                    "orderId": "5c0b520032eba53a888fd02x",  // 订单号
                    "clientOid": "ad123ad"                  // 可选，用于用户鉴别自己的订单
                */
                {
                    // received event
                }
            break;
            case 'open':
                /*
                    "symbol": "XBTUSDM",                        // 合约
                    "sequence": 3262786900,                 // 顺序号
                    "type": "open",
                    "orderId": "5c0b520032eba53a888fd02x",  // 订单号
                    "price": 3634.5,                        // 委托价格
                    "size": 10,                             // 委托数量
                    "side": "buy",                              // 委托方向
                    "orderTime": 1547697294838004923,       // 下单时间
                    "ts": 1547697294838004923,              // 进入买卖盘时间
                    "clientOid": "ad123ad"                  // 可选，用于用户鉴别自己的订单
                */
                {
                    // open event
                    const { side, orderId, price, size, orderTime, ts } = message;
                    const targetType = targetTypesMap[side];
                    if (_.indexOf(changeTypes, targetType) > -1) {
                        this.fullSnapshot[targetType][orderId] = [
                            // [0      , 1    ,  2  , 3     , 4]
                            // [下单时间, 订单号, 价格, 数量, 进入买卖盘时间]
                            orderTime, orderId, price, size, ts
                        ];
                    }
                }
            break;
            case 'match':  
                /*
                    "symbol": "XBTUSDM",                          // 合约
                    "sequence": 3262786901,                       // 顺序号
                    "type": "match",
                    "tradeId": "6c23b5454353a8882d023b3o",   // 交易号
                    "takerOrderId": "5c0b520032eba53a888fd01f",   // taker订单号
                    "makerOrderId": "5c0b520032eba53a888fd01e",   // maker订单号
                    "price": 3634,                               // 成交价格
                    "matchSize": 20,                             // 成交数量
                    "size": 10,                              // 订单剩余数量
                    "side": "buy",                               // taker的方向  
                    "ts": 1547697294838004923               // 成交时间 - 纳秒
                */
                {
                    // match event
                    const { side, makerOrderId, size } = message;
                    const targetType = targetTypesMap[side];
                    if (_.indexOf(changeTypes, targetType) > -1) {
                        if (this.fullSnapshot[targetType][makerOrderId]) {
                            if (size <= 0) {
                                delete this.fullSnapshot[targetType][makerOrderId];
                            } else {
                                this.fullSnapshot[targetType][makerOrderId][3] = size;
                            }
                        }
                    }
                }
            break;
            case 'update':
                /*
                    "symbol": "XBTUSDM",                           // 合约
                    "sequence": 3262786897,                    // 顺序号
                    "type": "update",
                    "orderId": "5c0b520032eba53a888fd01f",  // 订单号
                    "price": 3634,                          // 委托价格
                    "size": 100,                            // 改变后数量
                    "oldSize": 20,                           // 改变前大小
                    "ts": 1547697294838004923               // 更新时间 - 纳秒
                */
                {
                    // update event
                    const { orderId, size } = message;
                    if (this.fullSnapshot.asks[orderId]) {
                        if (size <= 0) {
                            delete this.fullSnapshot.asks[orderId];
                        } else {
                            this.fullSnapshot.asks[orderId][3] = size;
                        }
                    }
                    if (this.fullSnapshot.bids[orderId]) {
                        if (size <= 0) {
                            delete this.fullSnapshot.bids[orderId];
                        } else {
                            this.fullSnapshot.bids[orderId][3] = size;
                        }
                    }
                }
            break;
            case 'done':
                /*
                    "symbol": "XBTUSDM",                       // 合约
                    "sequence": 3262786901,                   // 顺序号
                    "type": "done",
                    "orderId": "5c0b520032eba53a888fd02x",    // 订单号
                    "reason": "filled",                      // filled or canceled
                    "ts": 1547697294838004923,          // 完成时间
                    "clientOid": "ad123ad"                  // 可选，用于用户鉴别自己的订单
                */
                {
                    // done event
                    const { orderId } = message;
                    if (this.fullSnapshot.asks[orderId]) {
                        delete this.fullSnapshot.asks[orderId];
                    }
                    if (this.fullSnapshot.bids[orderId]) {
                        delete this.fullSnapshot.bids[orderId];
                    }
                }
            break;
            default:
                {
                    log('invalid l3 type', type);
                    updated = false;
                }
            break;
        }

        if (updated) {
            this.fullSnapshot.sequence = sequence;

            // callback message
            if (typeof this.messageEventCallback === 'function') {
                this.messageEventCallback(message);
            }
        }
    }

    /** public */
    listen = () => {
        this.datafeed.connectSocket();
        this.datafeed.onClose(() => {
            log('ws closed, status ', this.datafeed.trustConnected);
            this.rebuild();
        });

        const topic = `/contractMarket/level3:${this.symbol}`;
        this.datafeed.subscribe(topic, (message) => {
            if (message.topic === topic) {
                // log(message);
                this.bufferMessage(message.data);
            }
        });
        this.rebuild();
    }

    // message event handler
    handleMessageEvent = (callback) => {
        if (typeof callback === 'function') {
            this.messageEventCallback = callback;
        }
    }

    // get detail order book
    getDetailOrderBook = (limit = 10) => {
        const dirty = this.fullSnapshot.dirty;
        const sequence = this.fullSnapshot.sequence;
        const asks = arrl3Map(this.fullSnapshot.asks, 'asks', 'asc').slice(0, limit);
        const bids = arrl3Map(this.fullSnapshot.bids, 'bids', 'desc').slice(0, limit);
        const ping = this.datafeed.ping;

        return {
            dirty,
            sequence,
            asks,
            bids,
            ping,
        };
    }

    // get merged order book
    getOrderBook = (limit = 10) => {
        const dirty = this.fullSnapshot.dirty;
        const sequence = this.fullSnapshot.sequence;
        const ping = this.datafeed.ping;

        const asks = arrl3Map(this.fullSnapshot.asks, 'asks', 'asc');
        const asksTmp = {};
        _.each(asks, ([price, size, ts, orderId]) => {
            if (asksTmp[price]) {
                asksTmp[price][0] += (+size);
                asksTmp[price][1][orderId] = true;
            } else {
                asksTmp[price] = [(+size), { [orderId]: true }];
            }
        });
        const finalAsks = arrMap(asksTmp, 'asc').slice(0, limit);

        const bids = arrl3Map(this.fullSnapshot.bids, 'bids', 'desc');
        const bidsTmp = {};
        _.each(bids, ([price, size, ts, orderId]) => {
            if (bidsTmp[price]) {
                bidsTmp[price][0] += (+size);
                bidsTmp[price][1][orderId] = true;
            } else {
                bidsTmp[price] = [(+size), { [orderId]: true }];
            }
        });
        const finalBids = arrMap(bidsTmp, 'desc').slice(0, limit);

        return {
            dirty,
            sequence,
            asks: finalAsks,
            bids: finalBids,
            ping,
        };
    }
}

export default Level3;