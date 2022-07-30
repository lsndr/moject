import 'reflect-metadata';

export { Inject, Injectable, Module } from './decorators';

export {
  Provider,
  ProviderScope,
  ClassProviderConstructor,
  ValueProviderConstructor,
  FactoryProviderConstructor,
  ProviderIdentifier,
} from './modules/types';

export { App } from './app/app';

export { AppOptions, ModuleMeta } from './app/types';

export { createModule } from './app/create-module';

export { IDENTIFIERS, Identifiers } from './app/identifiers';

export { Logger, AppLogger } from './app/services/logger';

export { ModuleRef } from './modules/module-ref';
