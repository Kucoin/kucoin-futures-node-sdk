import WebSocket from 'ws';
import WebSocketClient from '../src/websocket/socket';

// mock ws
jest.mock('ws');

jest.useFakeTimers();

describe('WebSocketClient', () => {
  const mockSocket = new WebSocket('mock');
  const client = new WebSocketClient('ws://example.com', mockSocket);

  beforeEach(() => {
    jest.spyOn(global.console, 'log');
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should generate to match _futures_', () => {
    expect(client.generateId()).toMatch('_futures_');
  });

  it('should generate a unique ID', () => {
    const id1 = client.generateId();
    const id2 = client.generateId();
    expect(id1).not.toEqual(id2);
  });

  it.each([
    {
      desc: 'should get the prefix topic empty string',
      topic: '',
      expected: ''
    },
    {
      desc: 'should get the prefix topic',
      topic: 'topic:ETH',
      expected: 'topic'
    }
  ])('%o', ({ topic, expected }) => {
    expect(client.getPrefixTopic(topic)).toBe(expected);
  });

  it('should socketSend data be JSON.stringify', () => {
    const mockSend = jest.spyOn(WebSocket.prototype, 'send');
    const mockData = { data: 'test' };
    client.socketSend(mockData);
    expect(console.log).toBeCalled();
    expect(mockSend).toBeCalled();
    expect(mockSend.mock.calls[0][0]).toBe(JSON.stringify(mockData));
  });

  it('setupWebSocket ws on times', () => {
    const mockSocket2 = new WebSocket('mock');
    const mockOn2 = jest.spyOn(WebSocket.prototype, 'on');
    new WebSocketClient('ws://example.com', mockSocket2);
    expect(mockOn2).toHaveBeenCalledTimes(4);
  });

  it('setupWebSocket ws on open', () => {
    const mockStartPing = jest.spyOn(WebSocketClient.prototype, 'startPing');
    const mockStartHeartbeat = jest.spyOn(
      WebSocketClient.prototype,
      'startHeartbeat'
    );
    const mockResubscribe = jest.spyOn(
      WebSocketClient.prototype,
      'resubscribe'
    );
    const mockPatchAllMessage = jest.spyOn(
      WebSocketClient.prototype,
      'patchAllMessage'
    );

    const mockSocket2 = new WebSocket('mock');
    new WebSocketClient('ws://example.com', mockSocket2);
    // emit open
    mockSocket2.emit('open');
    expect(console.log).toBeCalled();
    expect(mockStartPing).toBeCalled();
    expect(mockStartHeartbeat).toBeCalled();
    expect(mockResubscribe).toBeCalled();
    expect(mockPatchAllMessage).toBeCalled();

    // emit error
    mockSocket2.emit('error', 'test socket error');
    expect(console.error).toBeCalled();

    // emit close
    mockSocket2.emit('close');
    expect(console.log).toBeCalled();
  });

  it('should setupWebSocket on message', () => {
    const mockStopPing = jest.spyOn(WebSocketClient.prototype, 'stopPing');
    const mockHandleMessage = jest.spyOn(
      WebSocketClient.prototype,
      'handleMessage'
    );
    const mockSocket2 = new WebSocket('mock');
    new WebSocketClient('ws://example.com', mockSocket2);
    // emit message welcome
    const welcomeMsg = { type: 'welcome' };
    mockSocket2.emit('message', JSON.stringify(welcomeMsg));

    // @ts-ignore: spyOn global.console
    expect(console.log.mock.calls[0][1]).toEqual(welcomeMsg);

    // emit message pong
    const pongMsg = { type: 'pong' };
    mockSocket2.emit('message', JSON.stringify(pongMsg));
    expect(console.log).toBeCalled();
    expect(mockStopPing).toBeCalled();

    // emit message other
    const otherMsg = { type: 'other' };
    mockSocket2.emit('message', JSON.stringify(otherMsg));
    expect(mockHandleMessage).toBeCalledWith(otherMsg);
  });

  it('should startHeartbeat ping timeout', () => {
    jest
      .spyOn(WebSocketClient.prototype, 'startPing')
      .mockImplementation(() => {});
    const mockTerminate = jest.spyOn(WebSocket.prototype, 'terminate');
    const mockSocket2 = new WebSocket('mock');
    new WebSocketClient('ws://example.com', mockSocket2);
    // emit open
    mockSocket2.emit('open');
    jest.runAllTimers();
    expect(mockTerminate).toBeCalled();
  });

  it('should handleMessage strict callback', () => {
    const mockSocket2 = new WebSocket('mock');
    const client2 = new WebSocketClient('ws://example.com', mockSocket2);

    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    // strict true
    client2.subscribe('handleMessage:ETH', mockCallback1, false, true);
    // strict false
    client2.subscribe('handleMessage:ETH', mockCallback2, false, false);

     // emit message other
     const otherMsg = { type: 'other', topic: 'handleMessage' };
     mockSocket2.emit('message', JSON.stringify(otherMsg));

     expect(mockCallback1).not.toBeCalled();
     expect(mockCallback2).toBeCalled();

     const otherMsg2 = { type: 'other', topic: 'handleMessage:ETH' };
     mockSocket2.emit('message', JSON.stringify(otherMsg2));

     expect(mockCallback1).toBeCalled();
     expect(mockCallback2).toHaveBeenCalledTimes(2);
  });

  it('should subscribe to a topic', () => {
    const topic = 'test-topic';
    const callback = jest.fn();
    const privateChannel = false;
    const strict = true;

    const unsubscribe = client.subscribe(
      topic,
      callback,
      privateChannel,
      strict
    );

    // subscriptions
    expect(client.subscriptions).toHaveLength(1);
    expect(client.subscriptions[0]).toMatchObject({
      topic,
      callback,
      privateChannel,
      strict
    });

    // unsubscribe
    unsubscribe();
    expect(client.subscriptions).toHaveLength(0);
  });
});
