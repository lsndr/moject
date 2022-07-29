import { Module } from '../modules';
import { AppLogger } from './services';

export type AppEvents =
  | 'beforeStart'
  | 'afterStart'
  | 'beforeInit'
  | 'afterInit'
  | 'beforeStop'
  | 'afterStop';
export type AppEventHandler = () => unknown;
export type AppModule = Module & Partial<Record<AppEvents, AppEventHandler>>;
export interface AppModuleConstructor {
  beforeStart?: AppEventHandler;
  beforeInit?: AppEventHandler;
  new (...args: any): AppModule;
}

export type AppOptions = {
  logger?: AppLogger | false;
};
