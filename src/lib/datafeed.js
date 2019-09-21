
import http from './http'
import WebSocket from 'ws';
import EventEmitter from 'event-emitter';
import EventAllOff from 'event-emitter/all-off';
// import io from 'socket.io-client';
// import parser from 'socket.io-msgpack-parser';

export default class Datafeed {

    client = null;
    emitter = new EventEmitter();

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

        const connectId = (Math.random() * 365).toString(16).slice(4,14)+'yl';
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
                    console.log(`emit: welcome_${id}`);
                    this.emitter.emit(`welcome_${id}`);
                    break;
                // TODO message recieve
                default:
                    break;
            }
        };

        cl.onclose = () => {
            console.log('socket connect closed');
            // TODO try to reconnect or alert
        };
    }

    _handleAfterConnect = () => {
        console.log('recieved connect welcome ack');
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

    subscribe = (topic, _private = false) => {
        if (!this.client) {
            console.log('client not connected');
        }
        this.client.send(JSON.stringify({
            id: Date.now(),
            type: 'subscribe',
            topic,
            private: _private,
            response: true
        }));
    }

    unsubscribe = (topic) => {
        this.client.send(JSON.stringify({
            type: 'unsubscribe',
            topic,
        }));
    }
}