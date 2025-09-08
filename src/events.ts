export interface LogMessage {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'clear';
  timestamp: Date;
  zoneName: string;
}

export class ZoneEventEmitter {
  private listeners: ((message: LogMessage) => void)[] = [];

  on(listener: (message: LogMessage) => void): void {
    this.listeners.push(listener);
  }

  off(listener: (message: LogMessage) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  emit(message: LogMessage): void {
    this.listeners.forEach((listener) => listener(message));
  }
}

export const globalEventEmitter = new ZoneEventEmitter();
