import { Container } from 'inversify';

export type BuildOptions = {
  globalProviders?: Provider[];
};

export type Constructor<T = unknown> = new (...args: never[]) => T;

export type Module = object;

export type ProviderIdentifier = symbol | string | Constructor;

export type ProviderScope = 'TRANSIENT' | 'SINGLETONE';

export interface BaseProviderConstructor {
  identifier: ProviderIdentifier;
  scope?: ProviderScope;
}

export interface FactoryProviderConstructor extends BaseProviderConstructor {
  useFactory: (...args: any[]) => unknown | Promise<unknown>;
  inject?: ProviderIdentifier[];
}

export interface ValueProviderConstructor extends BaseProviderConstructor {
  useValue: unknown;
}

export interface ClassProviderConstructor extends BaseProviderConstructor {
  useClass: Constructor;
}

export type ProviderConstructor =
  | FactoryProviderConstructor
  | ValueProviderConstructor
  | ClassProviderConstructor;

export type Provider = Constructor | ProviderConstructor;

export type ModuleConstructor = Constructor<Module>;

export type ModuleProvder = {
  container: Container;
  meta: ModuleMeta<ModuleConstructor>;
};

export type ModuleMeta<C extends ModuleConstructor> = {
  imports: C[];
  hooks: Constructor[];
  providers: Provider[];
  exports: (Provider | C)[];
};
