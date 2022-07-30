import { injectable, inject } from 'inversify';
import { ProviderIdentifier } from './modules/types';
import { Module, ModuleMeta } from './app/types';
import { createModule } from './app/create-module';

export function Inject(
  identifier: ProviderIdentifier,
): ParameterDecorator | ParameterDecorator {
  return inject(identifier);
}

export function Injectable() {
  return injectable();
}

export function Module(options?: Partial<ModuleMeta>) {
  return <T extends Module>(constructor: T) => {
    createModule(constructor, options);
  };
}
