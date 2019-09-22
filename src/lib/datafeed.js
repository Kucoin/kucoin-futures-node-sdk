import _ from 'lodash';
import http from './http';
import log from './log';
import WebSocket from 'ws';
import EventEmitter from 'event-emitter';
import EventAllOff from 'event-emitter/all-off';
import { clearInterval } from 'timers';
// import io from 'socket.io-client';
// import parser from 'socket.io-msgpack-parser';

const generateId = () => '_e_' + Date.now() + (Math.random() * 365).toString(16).slice(4,14) + 'yl';
const loop = () => {};
const getTopicPrefix = topic => topic.split(':')[0];

export default class Datafeed {

    trustConnected = false;
    client = null;
    emitter = new EventEmitter();
    topicState = [];
    topicListener = {
        // topicPrefix => [...hooks],
    };
    incrementSubscribeId = 0;

    connectSocket = async () => {
        // clear all event
        EventAllOff(this.emitter);

        const config = await this._getPubToken();
        if (!config) {
            log('getPubToken config invalid');

            // try to reconnect
            _.delay(() => {
                this.connectSocket();
            }, 3000);
            return;
        }
        // log('getPubToken config: ', config);
        log('getPubToken config');

        const connectId = generateId();
        log('generate connectId: ', connectId);

        this.emitter.on(`welcome_${connectId}`, this._handleAfterConnect);
        log('waiting welcome ack...');

        const cl = await this._connect({
            server: config.data,
            connectId,
        });

        cl.onopen = () => {
            // ws.send('foo');
            log('socket connect opend');
            this.client = cl;
        };
          
        cl.onmessage = (evt) => {
            if (!evt.data) {
                log('invalid message');
                return;
            }
            let message = null;
            try {
                log('parse: ', evt.data);
                message = JSON.parse(evt.data);
            } catch (e) {
                log('parse message error');
                console.error(e);
            }
            if (!message) {
                return;
            }

            const { id, type } = message;
            switch(type) {
                case 'welcome':
                case 'ack':
                case 'pong':
                    // log(`emit: welcome_${id}`);
                    this.emitter.emit(`${type}_${id}`);
                    break;
                case 'message':
                    // message recieve
                    this._distribute(message);
                    break;
                case 'ping':
                default:
                    log('unhandle message', evt.data);
                    break;
            }
        };

        cl.onerror = (e) => {
            log('socket connect onerror', e.message);
        }

        cl.onclose = () => {
            log('socket connect closed');
            this._handleClose();

            // try to reconnect
            _.delay(() => {
                this.connectSocket();
            }, 3000);
        };
    }

    _onClose = null;
    _handleClose = () => {
        this.trustConnected = false;
        // on close
        if (typeof this._onClose === 'function') {
            this._onClose();
        }
    }

    onClose = (callback) => {
        if (typeof callback === 'function') {
            this._onClose = callback;
        }
        return this;
    };

    subscribe = (topic, hook = loop, _private = false) => {
        this.incrementSubscribeId += 1;

        const hookId = this.incrementSubscribeId;
        const listener = { hook, id: hookId };
        const prefix = getTopicPrefix(topic);
        if (this.topicListener[prefix]) {
            this.topicListener[prefix].push(listener);
        } else {
            this.topicListener[prefix] = [listener];
        }
        log('subscribed listener');

        const find = this.topicState.filter(item => item[0] === topic);
        if (find.length === 0) {
            log(`topic new subscribe: ${topic}`);
            this.topicState.push([topic, _private]);
            this._sub(topic, _private);
        } else {
            log(`topic already subscribed: ${topic}`);
        }

        log('subscribed listener id ', hookId);
        return hookId;
    }

    unsubscribe = (topic, hookId) => {
        const prefix = getTopicPrefix(topic);
        if (this.topicListener[prefix]) {
            const deleted = this.topicListener[prefix].filter(item => item.id !== hookId);
            if (deleted.length === 0) {
                delete this.topicListener[prefix];
            } else {
                this.topicListener[prefix] = deleted;
            }
        }
        log('unsubscribed listener id ', hookId);

        this.topicState = this.topicState.filter(record => record[0] !== topic);
        this._unsub(topic);
    }

    _distribute = (message) => {
        // { data: 
        //     { symbol: 'XBTUSDM',
        //       side: 'sell',
        //       size: 82,
        //       price: 10055,
        //       bestBidSize: 598,
        //       bestBidPrice: '10055.0',
        //       bestAskPrice: '10056.0',
        //       tradeId: '5d8645143c7feb4209f368e7',
        //       ts: 1569080596312353500,
        //       bestAskSize: 33882 },
        //    subject: 'ticker',
        //    topic: '/contractMarket/ticker:XBTUSDM',
        //    type: 'message' }
        const { topic } = message;
        if (topic) {
            const prefix = getTopicPrefix(topic);
            const listeners = this.topicListener[prefix];
            if (listeners) {
                _.each(listeners, ({ hook }) => {
                    if (typeof hook === 'function') {
                        hook(message);
                    }
                });
            }
        }
    }

    _handleAfterConnect = () => {
        log('recieved connect welcome ack');
        this.trustConnected = true;

        // resub
        _.each(this.topicState, ([topic, _private]) => {
            this._sub(topic, _private);
        });

        // restart ping
        this._ping();
    }

    _connect = async (config) => {
        const server = config.server;
        const connectId = config.connectId;
        const {
            instanceServers,
            token,
        } = server;
        const url = `${instanceServers[0].endpoint}?token=${token}&acceptUserMessage=true&connectId=${connectId}`;
        return new WebSocket(url, {
            handshakeTimeout: 30,
        });
    }

    _getPubToken = async () => {
        return await http.post('/api/v1/bullet-public');
    }

    _getPrivateToken = async () => {
        return await http.post('/api/v1/bullet-private');
    }

    _sub = (topic, _private = false) => {
        if (!this.trustConnected) {
            log('client not connected');
            return;
        }

        const id = generateId();
        this.emitter.once(`ack_${id}`, () => {
            log(`topic: ${topic} subscribed`);
        });

        this.client.send(JSON.stringify({
            id,
            type: 'subscribe',
            topic,
            private: _private,
            response: true
        }));
        log(`topic subscribe: ${topic}, send`);
    }

    _unsub = (topic) => {
        if (!this.trustConnected) {
            log('client not connected');
            return;
        }

        const id = generateId();
        this.emitter.once(`ack_${id}`, () => {
            log(`topic: ${topic} unsubscribed`);
        });

        this.client.send(JSON.stringify({
            id,
            type: 'unsubscribe',
            topic,
        }));
        log(`topic unsubscribe: ${topic}, send`);
    }

    _pingTs = null;
    _ping = () => {
        if (this._pingTs) {
            clearInterval(this._pingTs);
            this._pingTs = null;
        }

        this._pingTs = setInterval(() => {
            if (!this.trustConnected) {
                log('client not connected');
                return;
            }
            const id = generateId();

            // ping timeout
            const timer = setTimeout(() => {
                log('ping wait pong timeout');

                this._handleClose();
                this.connectSocket();
            }, 10000);
            this.emitter.once(`pong_${id}`, () => {
                log('ping get pong');
                clearTimeout(timer);
            });

            this.client.send(JSON.stringify({
                id,
                type: 'ping',
            }));
            log('ping, send');
        }, 20000);
    }
}