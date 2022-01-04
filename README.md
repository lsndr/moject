# Moject

[![CI](https://github.com/lsndr/moject/actions/workflows/ci.yml/badge.svg)](https://github.com/lsndr/moject/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/moject.svg)](https://badge.fury.io/js/moject)
[![npm downloads/month](https://img.shields.io/npm/dm/moject.svg)](https://www.npmjs.com/package/moject)
[![npm downloads](https://img.shields.io/npm/dt/moject.svg)](https://www.npmjs.com/package/moject)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lsndr/moject/blob/master/LICENSE.md)

`Moject` is a __dependency injection__ and __app factory__ package built around the modules idea of Angular and NestJs. 

`Moject` is currently based on InversifyJs.

## Usage

```
  npm install moject 
```

```typescript
// index.js

import { App } from 'moject';
import { WebModule } from './src/web.module.ts'

const app = App.create(WebModule);

(async () => {
  await app.start();
}).catch(console.error);
```

```typescript
// ./src/web.module.ts

import { Module, Inject } from 'moject';
import { Application }, express from 'express';
import { EXPRESS_APP_PROVIDER } from './constants';
import { HelloController } from './hello.controller.ts';

@Module({
  hooks: [HelloController],
  providers: [
    {
      identifier: EXPRESS_APP_PROVIDER,
      userFactory: express
    }
  ]
}) 
export class WebModule {
  constructor(@Inject(EXPRESS_APP_PROVIDER) private readonly app: Application) {}

  private async afterInit() {
    return new Promise((resolve, reject) => {
      this.express.listen(80, (err) => {
        if(err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}
```

```typescript
// ./src/hello.controller.ts

import { Injectable, Inject } from 'moject';
import { Application, Request, Response }, express from 'express';
import { EXPRESS_APP_PROVIDER } from './constants';

@Injectable() 
export class HelloController {
  constructor(@Inject(EXPRESS_APP_PROVIDER) private readonly app: Application) {
    app.on('/', this.helloWorld.bind(this));
  }

  private helloWorld(req: Request, res: Response) {
    res.send('Hello World!');
  }
}
```

## Injection scopes

#### TRANSIENT
Transient providers are not shared across consumers. Each consumer that injects a transient provider will receive a new, dedicated instance.


#### SINGLETONE
A single instance of the provider is shared across the entire application. The instance lifetime is tied directly to the application lifecycle. Once the application has bootstrapped, all singleton providers have been instantiated. Singleton scope is used by default.

## Hooks

Hooks are constructors that can not be injected anywhere but invoked once the application has bootstrapped.

For instance, hooks can be used to register routes of your web application.

## Providers

#### Class

```typescript
@Module({
  providers: [
    AppClass,
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