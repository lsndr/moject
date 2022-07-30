import { ModuleContainer } from '../modules/container';
import { Constructor, ProviderIdentifier, Module } from './types';

export class ModuleRef {
  constructor(private readonly container: ModuleContainer<Module>) {}

  get<T = any>(identifier: ProviderIdentifier): Promise<T> {
    return this.container.get<T>(identifier);
  }

  resolve<T = any>(constructor: Constructor<T>): Promise<T> {
    return this.container.resolve<T>(constructor);
  }
}
