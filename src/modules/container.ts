import { Container } from 'inversify';
import {
  Constructor,
  ModuleConstructor,
  ModuleMeta,
  ProviderIdentifier,
  ProviderConstructor,
  Provider,
} from './types';

export class ModuleContainer<C extends ModuleConstructor> {
  module?: InstanceType<C>;
  private readonly container: Container;

  constructor(readonly moduleConstructor: C, readonly meta: ModuleMeta<C>) {
    this.container = new Container({ skipBaseClassChecks: true });
    this.container.bind(moduleConstructor).toSelf().inSingletonScope();

    for (let i = 0; i < meta.providers.length; i++) {
      const provider = meta.providers[i];
      const providerConstructor: ProviderConstructor =
        this.isProviderConstructor(provider)
          ? provider
          : {
              identifier: provider,
              scope: 'SINGLETONE',
              useClass: provider,
            };

      let bind;

      if ('useClass' in providerConstructor) {
        bind = this.container
          .bind(providerConstructor.identifier)
          .to(providerConstructor.useClass);

        if (providerConstructor.scope === 'TRANSIENT') {
          bind.inTransientScope();
        } else {
          bind.inSingletonScope();
        }
      } else if ('useFactory' in providerConstructor) {
        bind = this.container
          .bind(providerConstructor.identifier)
          .toDynamicValue(async () => {
            const inject = providerConstructor.inject || [];
            const dependecies = [];

            for (const identifier of inject) {
              dependecies.push(await this.container.getAsync(identifier));
            }

            return providerConstructor.useFactory(...dependecies);
          });

        if (providerConstructor.scope === 'TRANSIENT') {
          bind.inTransientScope();
        } else {
          bind.inSingletonScope();
        }
      } else {
        bind = this.container
          .bind(providerConstructor.identifier)
          .toConstantValue(providerConstructor.useValue);
      }
    }
  }

  isProviderConstructor(value: Provider): value is ProviderConstructor {
    return (
      typeof value === 'object' &&
      value !== null &&
      'identifier' in value &&
      ('useValue' in value || 'useFactory' in value || 'useClass' in value)
    );
  }

  bind(identifier: ProviderIdentifier, provider: any) {
    if (typeof provider === 'function') {
      this.container.bind(identifier).toDynamicValue(provider);
    } else {
      this.container.bind(identifier).to(provider);
    }
  }

  get<T = any>(identifier: ProviderIdentifier): Promise<T> {
    return this.container.getAsync<T>(identifier);
  }

  async resolve<T = any>(constructor: Constructor<T>): Promise<T> {
    const identifier = Symbol();
    this.container.bind(identifier).to(constructor).inSingletonScope();
    const resolved = await this.container.getAsync<T>(identifier);
    this.container.unbind(identifier);

    return resolved;
  }

  async getModule(): Promise<InstanceType<C>> {
    if (typeof this.module === 'undefined') {
      const module = await this.container.getAsync(this.moduleConstructor);
      this.module = module;

      return module;
    } else {
      return this.module;
    }
  }
}
