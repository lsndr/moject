import { Module, App, Injectable, ModuleRef, Inject } from '../src';

describe('ModuleRef', () => {
  it('should properly get an instance of class', async () => {
    expect.assertions(2);

    @Injectable()
    class ClassToInject {}

    @Module({
      providers: [
        {
          identifier: 'CLASS_IDENTIFIER',
          useClass: ClassToInject,
        },
      ],
    })
    class TestModule {
      constructor(@Inject(ModuleRef) private readonly moduleRef: ModuleRef) {}

      async afterStart() {
        const instance1 = await this.moduleRef.get('CLASS_IDENTIFIER');
        const instance2 = await this.moduleRef.get('CLASS_IDENTIFIER');

        expect(instance1).toBe(instance2);
        expect(instance1).toBeInstanceOf(ClassToInject);
      }
    }

    const app = App.create(TestModule, {
      logger: false,
    });

    await app.start();
  });

  it('should properly resolve an instance of class', async () => {
    expect.assertions(3);

    @Injectable()
    class SomeClass {}

    @Module()
    class TestModule {
      constructor(@Inject(ModuleRef) private readonly moduleRef: ModuleRef) {}

      async afterStart() {
        const instance1 = await this.moduleRef.resolve(SomeClass);
        const instance2 = await this.moduleRef.resolve(SomeClass);

        expect(instance1).not.toBe(instance2);
        expect(instance1).toBeInstanceOf(SomeClass);
        expect(instance2).toBeInstanceOf(SomeClass);
      }
    }

    const app = App.create(TestModule, {
      logger: false,
    });

    await app.start();
  });
});
