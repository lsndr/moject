import { injectable, inject, decorate } from 'inversify';
import { ProviderIdentifier } from './modules';
import { registry } from './registry';
import { AppModuleConstructor, ModuleMeta } from './app';

export function Inject(
  identifier: ProviderIdentifier,
): ParameterDecorator | ParameterDecorator {
  return inject(identifier);
}

export function Injectable() {
  return injectable();
}

export function Module(options?: Partial<ModuleMeta>) {
  return <T extends AppModuleConstructor>(constructor: T) => {
    decorate(injectable(), constructor);
    registry.set(constructor, {
      imports: [],
      exports: [],
      providers: [],
      ...options,
    });
  };
}
