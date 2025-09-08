export interface ZoneConfig {
  name: string;
  width?: string | number;
  height?: string | number | 'auto';
  additionalTransports?: string[];
  showHeader?: boolean;
  borderColor?: string;
}

export interface Zone {
  name: string;
  innerWidth: number; // Width minus borders and padding
  width: number;
  height: number | 'auto';
  showHeader: boolean;
  transports: Transport[];
  originalWidth: string | number | undefined; // Keep original for layout calculations
  borderColor: string;
  
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
  clear(): void;
}

export interface Transport {
  name: string;
  write(message: string, level: LogLevel): void;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface ZoneManager {
  add(config: ZoneConfig): Zone;
  get(name: string): Zone | undefined;
  has(name: string): boolean;
  remove(name: string): boolean;
  list(): Zone[];
}