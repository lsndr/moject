import { decorate, injectable } from 'inversify';
import { registry } from './registry';
import { ModuleMeta, Module } from './app';

type DynamicModule = Module;

export function createModule(options?: Partial<ModuleMeta>): DynamicModule {
  const constructor = class DynamicModule {};

  decorate(injectable(), constructor);

  registry.set(constructor, {
    imports: [],
    exports: [],
    providers: [],
    ...options,
  });

  return constructor;
}
