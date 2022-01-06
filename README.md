# Moject

[![CI](https://github.com/lsndr/moject/actions/workflows/testing-ci.yml/badge.svg)](https://github.com/lsndr/moject/actions/workflows/testing-ci.yml)
[![npm version](https://badge.fury.io/js/moject.svg)](https://badge.fury.io/js/moject)
[![npm downloads/month](https://img.shields.io/npm/dm/moject.svg)](https://www.npmjs.com/package/moject)
[![npm downloads](https://img.shields.io/npm/dt/moject.svg)](https://www.npmjs.com/package/moject)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lsndr/moject/blob/master/LICENSE.md)

`Moject` is a __dependency injection__ and __app factory__ package built around the modules idea of Angular and NestJs. 

## Usage

```
  npm install moject 
```

Use `@Module` decorator to define modules, `@Injectable` and `@Inject` decorators to define and inject dependencies.

## Examples

See [examples](https://github.com/lsndr/moject/tree/master/examples).

## Modules

Each module is an isolated DI container. Modules can be used to group related dependencies. `Moject` doesn't dictate how to group dependencies, you can use module-per-feature, module-per-layer or any other approach. 

`@Module` decorator is used to define a module:

```typescript

@Module({
  imports: [/* modules to import */],
  hooks: [/* hooks */],
  providers: [/* providers */],
  exports: [/* providers and modules to export */]
})
export class AppModule {
  static async beforeStart() {
    // invoked before application starts
  }

  static async beforeInit() {
    // invoked beforo modules initialisation
  }

  async afterInit() {
    // invoked after modules initialisation
  }

  async beforeHooks() {
    // invoked before hooks
  }

  async afterHooks() {
    // invoked after hooks
  }

  async beforeStop() {
    // invoked before application stops
  }

  async afterStop() {
    // invoked after application stops
  }
}
```

## Providers

There are 3 types of providers: `class`, `factory` and `value`:

```typescript
@Module({
  providers: [
    // Class provider
    {
      identifier: 'APP_CLASS',
      useClass: AppClass,
    },
    // Shortened syntax for class provider
    AppClass,
    // Factory provider
    {
      identifier: 'FACTORY',
      useFactory: () => {
        return new AppClass();
      },
    },
    // Factory provider
    {
      identifier: 'FACTORY',
      useFactory: () => {
        return new AppClass();
      },
    },
    // Value provider
    {
      identifier: 'VALUE',
      useValue: 'value to inject',
    },
  ],
})
class AppModule {}
```

Each class provider must be marked with `@Injectable` decorator as shown below:

```typescript
@Injectable()
class AppClass {}
```

Use `@Inject` decorator to inject a dependency by its identifier:

```typescript
@Injectable()
class SomeOtherClass {
  constructor(@Inject(AppClass) appClass: AppClass) {
    // ...
  }
}
```

## Injection scopes

* `SINGLETONE` A single instance of the provider is shared across the entire application. __This is the default scope__.

* `TRANSIENT` Each consumer that injects a transient provider will receive a new, dedicated instance.

```typescript
@Module({
  providers: [
    // Singletone scope
    {
      identifier: SomeClass,
      useClass: SomeClass,
      scope: 'SINGLETONE'
    },
    // Transient scope
    {
      identifier: SomeOtherClass,
      useClass: SomeClassClass,
      scope: 'TRANSIENT'
    },
  ],
})
class AppModule {}
```

## Import/Exoprt

Each module can import other modules and export its providers or imported modules.

```typescript
// Databse module

@Module({
  providers: [DB],
  exports: [DB],
})
class DatabaseModule {}

// App module

@Module({
  imports: [DatabaseModule],
})
class AppModule {
  // Inject a provider imported from DatabaseModule
  constructor(@Inject(DB) private gateway: DB) {}

  async afterInit() {
    await this.gateway.migrate();
  }
}
```

## Hooks

Hooks are constructors that can not be injected anywhere but invoked once the application has bootstrapped.

For instance, hooks can be used to register routes of your web application.

See [examples](https://github.com/lsndr/moject/tree/master/examples).

## App Factory

Use `App` class to initialise modules and run hooks as shown below:

```typescript
import { AppModule } from './app.module';

// Build app
const app = App.create(AppModule);

// Start app
app.start().catch(console.error);
```

Once `app.start` is called, all your modules get initialised, dependencies resolved, and hooks invoked.

## License

Moject is [MIT licensed](LICENSE.md).