import _ from 'lodash';
import http from './http';
import WebSocket from 'ws';
import EventEmitter from 'event-emitter';
import EventAllOff from 'event-emitter/all-off';
// import io from 'socket.io-client';
// import parser from 'socket.io-msgpack-parser';

const generateId = () => '_e_' + Date.now() + (Math.random() * 365).toString(16).slice(4,14) + 'yl';

export default class Datafeed {

    trustConnected = false;
    client = null;
    emitter = new EventEmitter();
    topicState = [];

    connectSocket = async () => {
        // clear all event
        EventAllOff(this.emitter);

        const config = await this._getPubToken();
        if (!config) {
            console.log('getPubToken config invalid');
            return;
        }
        // console.log('getPubToken config: ', config);
        console.log('getPubToken config');

        const connectId = generateId();
        console.log('generate connectId: ', connectId);

        this.emitter.on(`welcome_${connectId}`, this._handleAfterConnect);
        console.log('waiting welcome ack...');

        const cl = await this._connect({
            server: config.data,
            connectId,
        });

        cl.onopen = () => {
            // ws.send('foo');
            console.log('socket connect opend');
            this.client = cl;
        };
          
        cl.onmessage = (evt) => {
            if (!evt.data) {
                console.log('invalid message');
                return;
            }
            let message = null;
            try {
                message = JSON.parse(evt.data);
            } catch (e) {
                console.log('parse message error');
                console.error(e);
            }
            if (!message) {
                return;
            }

            const { id, type } = message;
            switch(type) {
                case 'welcome':
                case 'ack':
                    // console.log(`emit: welcome_${id}`);
                    this.emitter.emit(`${type}_${id}`);
                    break;
                case 'message':
                    // TODO message recieve
                    console.log(message);
                    break;
                default:
                    break;
            }
        };

        cl.onerror = (e) => {
            console.log('socket connect onerror', e.message);
        }

        cl.onclose = () => {
            console.log('socket connect closed');
            this.trustConnected = false;
            // try to reconnect
            _.delay(3000, () => {
                this.connectSocket();
            });
        };
    }

    subscribe = (topic, _private = false) => {
        this.topicState.push([topic, _private]);
        this._sub(topic, _private);
    }

    unsubscribe = (topic) => {
        this.topicState = this.topicState.filter(record => record[0] !== topic);
        this._unsub(topic);
    }

    _handleAfterConnect = () => {
        console.log('recieved connect welcome ack');
        this.trustConnected = true;

        // resub
        _.each(this.topicState, ([topic, _private]) => {
            this._sub(topic, _private);
        });
    }

    _connect = async (config) => {
        const server = config.server;
        const connectId = config.connectId;
        const {
            instanceServers,
            token,
        } = server;
        const url = `${instanceServers[0].endpoint}?token=${token}&acceptUserMessage=true&connectId=${connectId}`;
        return new WebSocket(url);
    }

    _getPubToken = async () => {
        return await http.post('/api/v1/bullet-public');
    }

    _getPrivateToken = async () => {
        return await http.post('/api/v1/bullet-private');
    }

    _sub = (topic, _private = false) => {
        if (!this.trustConnected) {
            console.log('client not connected');
            return;
        }

        const id = generateId();
        this.emitter.once(`ack_${id}`, () => {
            console.log(`topic: ${topic} subscribed`);
        });

        this.client.send(JSON.stringify({
            id,
            type: 'subscribe',
            topic,
            private: _private,
            response: true
        }));
        console.log(`topic subscribe: ${topic}, send`);
    }

    _unsub = (topic) => {
        if (!this.trustConnected) {
            console.log('client not connected');
            return;
        }

        const id = generateId();
        this.emitter.once(`ack_${id}`, () => {
            console.log(`topic: ${topic} unsubscribed`);
        });

        this.client.send(JSON.stringify({
            type: 'unsubscribe',
            topic,
        }));
        console.log(`topic unsubscribe: ${topic}, send`);
    }
}