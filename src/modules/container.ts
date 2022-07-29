import { Container } from 'inversify';
import {
  Constructor,
  Module,
  ModuleMeta,
  ProviderIdentifier,
  ProviderConstructor,
  Provider,
} from './types';

const containersMap: WeakMap<ModuleContainer, Container> = new WeakMap();

export class ModuleContainer<C extends Module = Module> {
  private module?: InstanceType<C>;
  private readonly container: Container;

  constructor(readonly moduleConstructor: C, readonly meta: ModuleMeta<C>) {
    this.container = new Container({ skipBaseClassChecks: true });
    this.container.bind(moduleConstructor).toSelf().inSingletonScope();

    containersMap.set(this, this.container);

    for (const provider of meta.providers) {
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

  private isProviderConstructor(value: Provider): value is ProviderConstructor {
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

  setParent(parentContainer: ModuleContainer) {
    const container = containersMap.get(parentContainer);

    if (!container) {
      throw new Error('Invalid container');
    }

    this.container.parent = container;
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
