import { injectable, inject, decorate } from 'inversify';
import { ProviderIdentifier } from './modules';
import { registry } from './registry';
import { ModuleConstructor, ModuleMeta } from './app';

export function Inject(
  identifier: ProviderIdentifier,
): ParameterDecorator | ParameterDecorator {
  return inject(identifier);
}

export function Injectable() {
  return injectable();
}

export function Module(options?: Partial<ModuleMeta>) {
  return <T extends ModuleConstructor>(constructor: T) => {
    decorate(injectable(), constructor);
    registry.set(constructor, {
      imports: [],
      exports: [],
      providers: [],
      ...options,
    });
  };
}
