import {
  ModuleInstace as BaseModuleInstance,
  ModuleMeta as BaseModuleMeta,
} from '../modules';
import { AppLogger } from './services';

export type AppEvents =
  | 'beforeStart'
  | 'afterStart'
  | 'beforeInit'
  | 'afterInit'
  | 'beforeStop'
  | 'afterStop';

export type AppEventHandler = () => unknown;

export type ModuleInstance = BaseModuleInstance &
  Partial<Record<AppEvents, AppEventHandler>>;

export interface Module {
  beforeStart?: AppEventHandler;
  beforeInit?: AppEventHandler;
  new (...args: any): ModuleInstance;
}

export type ModuleMeta = BaseModuleMeta<Module>;

export type AppOptions = {
  logger?: AppLogger | false;
};
