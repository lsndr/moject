import { Module } from './modules';

export type AppEvents =
  | 'beforeStart'
  | 'afterStart'
  | 'beforeInit'
  | 'afterInit'
  | 'beforeHooks'
  | 'afterHooks'
  | 'beforeStop'
  | 'afterStop';
export type AppEventHandler = () => unknown;
export type AppModule = Module & Partial<Record<AppEvents, AppEventHandler>>;
export interface AppModuleConstructor {
  beforeStart?: AppEventHandler;
  beforeInit?: AppEventHandler;
  new (...args: any): AppModule;
}
