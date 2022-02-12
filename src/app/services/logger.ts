import { debuglog } from 'util';
import { Injectable } from '../..';

export interface AppLogger {
  log(message: string, ...data: any[]): void;
  error(message: string, ...data: any[]): void;
  warn(message: string, ...data: any[]): void;
  debug(section: string, message: string, ...data: any[]): void;
}

@Injectable()
export class Logger implements AppLogger {
  log(message: string, ...data: any[]): void {
    console.log(
      `\x1b[35m${new Date().toISOString()}\x1b[0m`,
      '\x1b[33m[LOG]\x1b[0m',
      `\x1b[32m${message}\x1b[0m`,
      ...data,
    );
  }

  warn(message: string, ...data: any[]): void {
    console.error(
      `\x1b[35m${new Date().toISOString()}\x1b[0m`,
      '\x1b[33m[WARN]\x1b[0m',
      `\x1b[91m${message}\x1b[0m`,
      ...data,
    );
  }

  error(message: string, ...data: any[]): void {
    console.error(
      `\x1b[35m${new Date().toISOString()}\x1b[0m`,
      '\x1b[33m[ERROR]\x1b[0m',
      `\x1b[41m${message}\x1b[0m`,
      ...data,
    );
  }

  debug(section: string, message: string, ...data: any[]): void {
    const debug = debuglog(section);

    debug(
      `\x1b[35m${new Date().toISOString()}\x1b[0m`,
      '\x1b[33m[DEBUG]\x1b[0m',
      `\x1b[33m${message}\x1b[0m`,
      ...data,
    );
  }
}
