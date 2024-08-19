import WebSocket from 'ws';
import { uniqWith, isEqual, forEach } from 'lodash';
import { Subscription, Callback } from '../dataType/socket';

export default class WebSocketClient {
  private ws: WebSocket;
  private _url: string;
  private alive: boolean = false;
  private messageHandler: any[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pingTimeout: NodeJS.Timeout | null = null;
  private subscribeMap: { [key: string]: Boolean };
  public subscriptions: Subscription[] = [];

  constructor(url: string, websocket: WebSocket) {
    this.ws = websocket;
    this._url = url;
    this.subscribeMap = {};
    this.setupWebSocket();
  }

  generateId(): string {
    return (
      '_futures_' + Date.now() + (Math.random() * 365).toString(16).slice(4, 14)
    );
  }

  getPrefixTopic(topic: string): string {
    if (!topic) return '';
    return topic.split(':')[0];
  }

  socketSend(data: object): void {
    const params = JSON.stringify(data);
    console.log('socket send --->', params);
    this.ws.send(params);
  }

  setupWebSocket(): void {
    this.ws.on('open', () => {
      console.log('WebSocket connected');
      this.alive = true;
      this.startHeartbeat();
      this.startPing();
      this.resubscribe();
      this.patchAllMessage();
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());

      if (message) {
        switch (message.type) {
          case 'welcome':
          case 'ack':
            console.log('socket message --->', message);
            break;
          case 'pong':
            console.log('socket message --->', message);
            this.stopPing();
            break;
          default:
            this.handleMessage(message);
        }
      }
    });

    this.ws.on('close', () => {
      console.log('WebSocket disconnected');
      this.alive = false;

      this.stopHeartbeat();
      this.stopPing();
      this.reconnect();
    });

    this.ws.on('error', (error) => {
      this.alive = false;
      console.error('WebSocket error:', error);
    });
  }

  // Send ping messages every 59s
  startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      this.resetPingTimeout();
      this.socketSend({ id: this.generateId(), type: 'ping' });
    }, 59000);
  }

  // Stop ping message
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = null;
    }
  }

  // Init Send ping message
  startPing(): void {
    this.resetPingTimeout();
    this.socketSend({ id: this.generateId(), type: 'ping' });
  }

  // Clear ping timeout
  stopPing(): void {
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);

      this.pingTimeout = null;
    }
  }

  // Reset Ping timeout
  resetPingTimeout(): void {
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
    }

    this.pingTimeout = setTimeout(() => {
      console.log('No pong received within 10 seconds, disconnecting...');

      this.ws.terminate();
    }, 10000);
  }

  // resubscribe
  resubscribe(): void {
    this.subscribeMap = {};
    this.subscriptions.forEach(({ id, topic, privateChannel }) => {
      if (!this.subscribeMap[`${topic}_${privateChannel}`]) {
        this.socketSend({
          id,
          type: 'subscribe',
          topic,
          privateChannel,
          response: true
        });
        this.subscribeMap[`${topic}_${privateChannel}`] = true;
      }else{
        console.log(`Subscribe Topic:${topic} privateChannel:${privateChannel} repeat`)
      }
    });
  }

  handleMessage(message: any): void {
    this.subscriptions.forEach(({ topic, callback, strict }) => {
      if (strict) {
        if (topic === message.topic) {
          callback(message);
        }
      } else {
        if (this.getPrefixTopic(topic) === this.getPrefixTopic(message.topic)) {
          callback(message);
        }
      }
    });
  }

  // When sending a message to the socket channel,
  // the socket may not be connected at this time,
  // it needs to be saved, wait for the connection to be established,
  // and trigger the message in messageHandler
  patchAllMessage(): void {
    const sendMessages = uniqWith(this.messageHandler, isEqual);
    forEach(sendMessages, (sendMessage) => {
      this.socketSend(sendMessage);
      this.messageHandler = this.messageHandler.filter(
        (item) => !isEqual(sendMessage, item)
      );
    });
  }

  getConnectionState(): number {
    return this.ws.readyState;
  }

  subscribe(
    topic: string,
    callback: Callback,
    privateChannel: boolean = false,
    strict = true
  ): Function {
    const _id = this.generateId();
    this.subscriptions.push({
      id: _id,
      topic,
      privateChannel,
      callback,
      strict
    });

    return () => this.unsubscribe(topic, _id);
  }

  unsubscribe(topic: string, id: string): void {
    const currentTopic = this.subscriptions.find((subscription) => {
      if (id) return subscription.topic === topic && subscription.id === id;
      return subscription.topic === topic;
    });

    if (currentTopic) {
      const sendMessage = {
        id: this.generateId(),
        type: 'unsubscribe',
        topic,
        privateChannel: currentTopic.privateChannel,
        response: true
      };

      if (this.alive) {
        this.socketSend(sendMessage);
      } else {
        this.messageHandler.push(sendMessage);
      }
    }

    this.subscriptions = this.subscriptions.filter((subscription) => {
      if (id) return !(subscription.topic === topic && subscription.id === id);
      return subscription.topic !== topic;
    });
  }

  // reconnect WebSocket
  reconnect(): void {
    console.log('Attempting to reconnect...');
    setTimeout(() => {
      this.ws = new WebSocket(this._url);
      this.setupWebSocket();
    }, 5000);
  }
}
