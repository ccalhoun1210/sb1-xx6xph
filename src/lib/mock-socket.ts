import EventEmitter from 'events';

class MockSocket extends EventEmitter {
  private connected = false;
  private messageHandlers: Map<string, Function> = new Map();

  constructor() {
    super();
    this.connect();
  }

  connect() {
    setTimeout(() => {
      this.connected = true;
      this.emit('connect');
    }, 100);
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnect');
  }

  emit(event: string, ...args: any[]) {
    if (!this.connected && event !== 'connect') {
      throw new Error('Socket not connected');
    }

    // Handle callbacks for acknowledgments
    if (args.length > 0 && typeof args[args.length - 1] === 'function') {
      const callback = args.pop();
      setTimeout(() => callback(null, { success: true }), 100);
    }

    super.emit(event, ...args);
    return this;
  }

  on(event: string, handler: Function) {
    this.messageHandlers.set(event, handler);
    return super.on(event, handler);
  }

  off(event: string) {
    const handler = this.messageHandlers.get(event);
    if (handler) {
      this.removeListener(event, handler);
      this.messageHandlers.delete(event);
    }
    return this;
  }

  // Mock method to simulate receiving messages
  simulateMessage(message: any) {
    if (this.connected) {
      this.emit('message', message);
    }
  }
}

export const createMockSocket = () => new MockSocket();