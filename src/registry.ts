import { ModuleMeta } from './modules';
import { AppModuleConstructor } from './types';

export const registry = new Map<
  AppModuleConstructor,
  ModuleMeta<AppModuleConstructor>
>();
