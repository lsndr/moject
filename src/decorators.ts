import { injectable, inject, decorate } from 'inversify';
import { ModuleMeta, ProviderIdentifier } from './modules';
import { registry } from './registry';
import { AppModuleConstructor } from './types';

export function Inject(
  identifier: ProviderIdentifier,
): ParameterDecorator | ParameterDecorator {
  return inject(identifier);
}

export function Injectable() {
  return injectable();
}

export function Module(options?: Partial<ModuleMeta<AppModuleConstructor>>) {
  return <T extends AppModuleConstructor>(constructor: T) => {
    decorate(injectable(), constructor);
    registry.set(constructor, {
      hooks: [],
      imports: [],
      exports: [],
      providers: [],
      ...options,
    });
  };
}
