import { IDENTIFIERS } from '.';
import { ProviderIdentifier } from './../modules';
import { ModuleBuilder } from './../modules/builder';
import { ModuleContainer } from './../modules/container';
import { registry } from './../registry';
import { Logger } from './services/logger';
import { AppEvents, AppOptions, AppModuleConstructor } from './types';

export class App {
  private lastReportAt?: number;
  private options: Required<AppOptions>;

  private constructor(
    private readonly containers: Map<
      AppModuleConstructor,
      ModuleContainer<AppModuleConstructor>
    >,
    private readonly rootModule: AppModuleConstructor,
    options?: AppOptions,
  ) {
    this.options = {
      logger: new Logger(),
      ...options,
    };
  }

  static create(rootModule: AppModuleConstructor, options?: AppOptions) {
    const builder = new ModuleBuilder<AppModuleConstructor>(registry);
    const containers = builder.build(rootModule, {
      globalProviders: [{ identifier: IDENTIFIERS.LOGGER, useClass: Logger }],
    });

    return new this(containers, rootModule, options);
  }

  private log(text: string) {
    if (this.options.logger === false) {
      return;
    }

    const lastReportAt = Date.now();
    const diff = lastReportAt - (this.lastReportAt || 0);

    this.options.logger.log(
      text,
      typeof this.lastReportAt !== 'undefined'
        ? `\x1b[33m+${diff}ms\x1b[0m`
        : '',
    );

    this.lastReportAt = lastReportAt;
  }

  private async initModules() {
    for (const container of this.containers.values()) {
      await container.getModule();

      this.log(
        `Dependencies of \`${container.moduleConstructor.name}\` initialized`,
      );
    }
  }

  private async invokeHooks() {
    for (const container of this.containers.values()) {
      for (let i = 0; i < container.meta.hooks.length; i++) {
        const hook = container.meta.hooks[i];

        await container.resolve(hook);

        this.log(`\x1b[33m[${hook.name}]\x1b[0m \x1b[32mHook invoked\x1b[0m`);
      }
    }
  }

  private async runEventHandlers(event: AppEvents) {
    for (const container of this.containers.values()) {
      if (event === 'beforeStart' || event === 'beforeInit') {
        await container.moduleConstructor[event]?.call(
          container.moduleConstructor,
        );
      } else {
        const module = await container.getModule();
        await module[event]?.call(module);
      }
    }

    this.log(`Runned \`${event}\` event handlers`);
  }

  get<T = any>(identifier: ProviderIdentifier): Promise<T> {
    const container = this.containers.get(this.rootModule);

    if (!container) {
      throw new Error();
    }

    return container.get(identifier);
  }

  async start() {
    this.log('Starting application...');

    await this.runEventHandlers('beforeStart');
    await this.runEventHandlers('beforeInit');

    await this.initModules();

    await this.runEventHandlers('afterInit');
    await this.runEventHandlers('beforeHooks');

    await this.invokeHooks();

    await this.runEventHandlers('afterHooks');
    await this.runEventHandlers('afterStart');

    this.log('Application is running');
  }

  async stop() {
    this.log('Stopping application');

    await this.runEventHandlers('beforeStop');
    await this.runEventHandlers('afterStop');

    this.log('Application stopped=');
  }
}
