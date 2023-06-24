// Mock Event emitter
export default class Socket {
  events: any;
  readyState: string;
  constructor() {
    this.events = {};
    this.readyState = 'init';
  }

  // on
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }

  // off
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback
    );
  }

  // emit
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName].forEach((callback) => {
      callback.apply(null, args);
    });
  }

  send(eventName, ...args){
    this.emit(eventName, ...args);
  }

  terminate(){
    this.emit('close');
    this.readyState = 'close';
  }
}
