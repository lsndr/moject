import { ModuleMeta } from './modules';
import { AppModuleConstructor } from './app/types';

export const registry = new Map<
  AppModuleConstructor,
  ModuleMeta<AppModuleConstructor>
>();
