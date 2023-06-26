import WebSocket from 'ws';
import { Subscription, Callback } from '../dataType/socket';
export default class WebSocketClient {
    private ws;
    private _url;
    private alive;
    private messageHandler;
    private heartbeatInterval;
    private pingTimeout;
    subscriptions: Subscription[];
    constructor(url: string, websocket: WebSocket);
    generateId(): string;
    getPrefixTopic(topic: string): string;
    socketSend(data: object): void;
    setupWebSocket(): void;
    startHeartbeat(): void;
    stopHeartbeat(): void;
    startPing(): void;
    stopPing(): void;
    resetPingTimeout(): void;
    resubscribe(): void;
    handleMessage(message: any): void;
    patchAllMessage(): void;
    getConnectionState(): number;
    subscribe(topic: string, callback: Callback, privateChannel?: boolean, strict?: boolean): Function;
    unsubscribe(topic: string, id: string): void;
    reconnect(): void;
}
