
import http from './http'
import io from 'socket.io-client';
import WebSocket from 'ws';

// import parser from 'socket.io-msgpack-parser';

export default class Strategy {

    client = null;
    async connect(config) {
        const server = config.data;
        const connectId = (Math.random() * 365).toString(16).slice(4,14)+'yl';
        const {
            instanceServers, token
        } = server;
        const url = `${instanceServers[0].endpoint}?token=${token}&acceptUserMessage=true&connectId=${connectId}`;
        const client = new WebSocket(url)
        return client;
    }


    async getPubToken() {
        const result = await http.post('/api/v1/bullet-public')
        return result;
    }

    async getPrivateToken() {
        return http.post('/api/v1/bullet-private')
    }

    async connectSocket() {
        const self = this;
        const config = await this.getPubToken();
        if(!config){
            return;
        }
        const client = await this.connect(config)

        client.onopen =  function () {
            // ws.send('foo');
            console.log('foo')
            self.client = client;
        };
          
        client.onmessage = function (evt) {
            console.log(evt.data);
        };
    }

    subscribe(topic, _private = false) {
        if(!this.client){
            console.log('client not connected')
        }
        this.client.send(JSON.stringify({
            id: Date.now(),
            type: 'subscribe',
            topic,
            private: _private,
            response: true
        }));
    }

    unsubscribe(topic) {
        this.client.send(JSON.stringify({
            type: 'unsubscribe',
            topic,
        }))
    }
}