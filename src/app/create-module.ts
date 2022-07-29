import { decorate, injectable } from 'inversify';
import { registry } from './registry';
import { ModuleMeta, Module } from './types';

export function createModule(
  module: Module,
  options?: Partial<ModuleMeta>,
): Module {
  decorate(injectable(), module);

  registry.set(module, {
    imports: [],
    exports: [],
    providers: [],
    ...options,
  });

  return module;
}
