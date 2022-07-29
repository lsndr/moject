import { BuildOptions } from '.';
import { ModuleContainer } from './container';
import { ModuleConstructor, ModuleMeta } from './types';

class GlobalModule {}

export class ModuleBuilder<C extends ModuleConstructor> {
  private readonly registry: Map<C, ModuleMeta<C>>;

  constructor(registry: Map<C, ModuleMeta<C>>) {
    this.registry = registry;
  }

  add(constructor: C, meta: Partial<ModuleMeta<C>>) {
    this.registry.set(constructor, {
      imports: [],
      providers: [],
      exports: [],
      ...meta,
    });
  }

  private buildContainers(rootModuleConstructor: C, options?: BuildOptions) {
    const containers: Map<C, ModuleContainer<C>> = new Map();
    const globalContainer = new ModuleContainer(GlobalModule, {
      imports: [],
      providers: options?.globalProviders || [],
      exports: [],
    });

    const build = (moduleConstructor: C) => {
      if (containers.has(moduleConstructor)) {
        return;
      }

      const meta = this.registry.get(moduleConstructor);

      if (typeof meta === 'undefined') {
        throw new Error(`Module ${moduleConstructor.name} not found`);
      }

      const container = new ModuleContainer(moduleConstructor, meta);
      container.setParent(globalContainer);

      containers.set(moduleConstructor, container);

      if (typeof meta.imports !== 'undefined') {
        for (let i = 0; i < meta.imports.length; i++) {
          build(meta.imports[i]);
        }
      }
    };

    build(rootModuleConstructor);

    return containers;
  }

  private isModule(value: any): value is C {
    return !!this.registry.has(value);
  }

  private connectContainers(containers: Map<C, ModuleContainer<C>>) {
    const bindImports = (container: ModuleContainer<C>, imports: C[]) => {
      for (let i = 0; i < imports.length; i++) {
        const imported = containers.get(imports[i]);

        if (typeof imported === 'undefined') {
          continue;
        }

        for (let j = 0; j < imported.meta.exports.length; j++) {
          const provider = imported.meta.exports[j];
          const isModule = this.isModule(provider);

          if (!isModule) {
            const identifier =
              typeof provider === 'object' &&
              provider !== null &&
              'identifier' in provider
                ? provider.identifier
                : provider;

            container.bind(identifier, () => imported.get(identifier));
          } else {
            bindImports(container, imported.meta.imports);
          }
        }
      }
    };

    for (const container of containers.values()) {
      bindImports(container, container.meta.imports);
    }
  }

  build(rootModule: C, options?: BuildOptions) {
    const containers = this.buildContainers(rootModule, options);
    this.connectContainers(containers);

    return containers;
  }
}
