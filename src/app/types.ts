import { Module as BaseModule, ModuleMeta as BaseModuleMeta } from '../modules';
import { AppLogger } from './services';

export type AppEvents =
  | 'beforeStart'
  | 'afterStart'
  | 'beforeInit'
  | 'afterInit'
  | 'beforeStop'
  | 'afterStop';

export type AppEventHandler = () => unknown;

export type Module = BaseModule & Partial<Record<AppEvents, AppEventHandler>>;

export interface ModuleConstructor {
  beforeStart?: AppEventHandler;
  beforeInit?: AppEventHandler;
  new (...args: any): Module;
}

export type ModuleMeta = BaseModuleMeta<ModuleConstructor>;

export type AppOptions = {
  logger?: AppLogger | false;
};
