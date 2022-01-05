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

Use `@Module` decorator to define modules. Use `@Injectable` and `@Inject` decorators to define and inject dependencies.

## Examples

See [examples](https://github.com/lsndr/moject/tree/master/examples).

## Hooks

Hooks are constructors that can not be injected anywhere but invoked once the application has bootstrapped.

For instance, hooks can be used to register routes of your web application.

See [examples](https://github.com/lsndr/moject/tree/master/examples).

## Injection scopes

* __TRANSIENT__ Each consumer that injects a transient provider will receive a new, dedicated instance.


* __SINGLETONE__ A single instance of the provider is shared across the entire application.

## Providers

#### Class

```typescript
@Module({
  providers: [
    AppClass2,
    {
      identifier: 'APP_CLASS_2',
      useClass: AppClass2
    }
  ]
})
class AppModule {}
```

#### Factory

```typescript
@Module({
  providers: [{
    identifier: 'FACTORY',
    useFactory: () => {
      return 'this string will be injected';
    }
  }]
})
class AppModule {}
```

#### Value

```typescript
@Module({
  providers: [{
    identifier: 'VALUE',
    useValue: 'this value will be injected'
  }]
})
class AppModule {}
```

## License

Moject is [MIT licensed](LICENSE.md).