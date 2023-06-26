"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var lodash_1 = require("lodash");
var WebSocketClient = /** @class */ (function () {
    function WebSocketClient(url, websocket) {
        this.alive = false;
        this.messageHandler = [];
        this.heartbeatInterval = null;
        this.pingTimeout = null;
        this.subscriptions = [];
        this.ws = websocket;
        this._url = url;
        this.setupWebSocket();
    }
    WebSocketClient.prototype.generateId = function () {
        return ('_futures_' + Date.now() + (Math.random() * 365).toString(16).slice(4, 14));
    };
    WebSocketClient.prototype.getPrefixTopic = function (topic) {
        if (!topic)
            return '';
        return topic.split(':')[0];
    };
    WebSocketClient.prototype.socketSend = function (data) {
        var params = JSON.stringify(data);
        console.log('socket send --->', params);
        this.ws.send(params);
    };
    WebSocketClient.prototype.setupWebSocket = function () {
        var _this = this;
        this.ws.on('open', function () {
            console.log('WebSocket connected');
            _this.alive = true;
            _this.startHeartbeat();
            _this.startPing();
            _this.resubscribe();
            _this.patchAllMessage();
        });
        this.ws.on('message', function (data) {
            var message = JSON.parse(data.toString());
            if (message) {
                switch (message.type) {
                    case 'welcome':
                    case 'ack':
                        console.log('socket message --->', message);
                        break;
                    case 'pong':
                        console.log('socket message --->', message);
                        _this.stopPing();
                        break;
                    default:
                        _this.handleMessage(message);
                }
            }
        });
        this.ws.on('close', function () {
            console.log('WebSocket disconnected');
            _this.alive = false;
            _this.stopHeartbeat();
            _this.stopPing();
            _this.reconnect();
        });
        this.ws.on('error', function (error) {
            _this.alive = false;
            console.error('WebSocket error:', error);
        });
    };
    // Send ping messages every 59s
    WebSocketClient.prototype.startHeartbeat = function () {
        var _this = this;
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = setInterval(function () {
            _this.resetPingTimeout();
            _this.socketSend({ id: _this.generateId(), type: 'ping' });
        }, 59000);
    };
    // Stop ping message
    WebSocketClient.prototype.stopHeartbeat = function () {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    };
    // Init Send ping message
    WebSocketClient.prototype.startPing = function () {
        this.resetPingTimeout();
        this.socketSend({ id: this.generateId(), type: 'ping' });
    };
    // Clear ping timeout
    WebSocketClient.prototype.stopPing = function () {
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = null;
        }
    };
    // Reset Ping timeout
    WebSocketClient.prototype.resetPingTimeout = function () {
        var _this = this;
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
        }
        this.pingTimeout = setTimeout(function () {
            console.log('No pong received within 10 seconds, disconnecting...');
            _this.ws.terminate();
        }, 10000);
    };
    // resubscribe
    WebSocketClient.prototype.resubscribe = function () {
        var _this = this;
        this.subscriptions.forEach(function (_a) {
            var id = _a.id, topic = _a.topic, privateChannel = _a.privateChannel;
            _this.socketSend({
                id: id,
                type: 'subscribe',
                topic: topic,
                privateChannel: privateChannel,
                response: true
            });
        });
    };
    WebSocketClient.prototype.handleMessage = function (message) {
        var _this = this;
        this.subscriptions.forEach(function (_a) {
            var topic = _a.topic, callback = _a.callback, strict = _a.strict;
            if (strict) {
                if (topic === message.topic) {
                    callback(message);
                }
            }
            else {
                if (_this.getPrefixTopic(topic) === _this.getPrefixTopic(message.topic)) {
                    callback(message);
                }
            }
        });
    };
    // When sending a message to the socket channel,
    // the socket may not be connected at this time,
    // it needs to be saved, wait for the connection to be established,
    // and trigger the message in messageHandler
    WebSocketClient.prototype.patchAllMessage = function () {
        var _this = this;
        var sendMessages = (0, lodash_1.uniqWith)(this.messageHandler, lodash_1.isEqual);
        (0, lodash_1.forEach)(sendMessages, function (sendMessage) {
            _this.socketSend(sendMessage);
            _this.messageHandler = _this.messageHandler.filter(function (item) { return !(0, lodash_1.isEqual)(sendMessage, item); });
        });
    };
    WebSocketClient.prototype.getConnectionState = function () {
        return this.ws.readyState;
    };
    WebSocketClient.prototype.subscribe = function (topic, callback, privateChannel, strict) {
        var _this = this;
        if (privateChannel === void 0) { privateChannel = false; }
        if (strict === void 0) { strict = true; }
        var _id = this.generateId();
        this.subscriptions.push({
            id: _id,
            topic: topic,
            privateChannel: privateChannel,
            callback: callback,
            strict: strict
        });
        return function () { return _this.unsubscribe(topic, _id); };
    };
    WebSocketClient.prototype.unsubscribe = function (topic, id) {
        var currentTopic = this.subscriptions.find(function (subscription) {
            if (id)
                return subscription.topic === topic && subscription.id === id;
            return subscription.topic === topic;
        });
        if (currentTopic) {
            var sendMessage = {
                id: this.generateId(),
                type: 'unsubscribe',
                topic: topic,
                privateChannel: currentTopic.privateChannel,
                response: true
            };
            if (this.alive) {
                this.socketSend(sendMessage);
            }
            else {
                this.messageHandler.push(sendMessage);
            }
        }
        this.subscriptions = this.subscriptions.filter(function (subscription) {
            if (id)
                return !(subscription.topic === topic && subscription.id === id);
            return subscription.topic !== topic;
        });
    };
    // reconnect WebSocket
    WebSocketClient.prototype.reconnect = function () {
        var _this = this;
        console.log('Attempting to reconnect...');
        setTimeout(function () {
            _this.ws = new ws_1.default(_this._url);
            _this.setupWebSocket();
        }, 5000);
    };
    return WebSocketClient;
}());
exports.default = WebSocketClient;
