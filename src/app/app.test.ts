import { Module, App, Injectable, Provider } from '../';

describe('App', () => {
  it('should invoke hooks on start', async () => {
    let hooksInvoked = 0;

    @Injectable()
    class Hook1 {
      constructor() {
        hooksInvoked++;
      }
    }

    @Injectable()
    class Hook2 {
      constructor() {
        hooksInvoked++;
      }
    }

    @Module({
      hooks: [Hook1, Hook2],
    })
    class TestModule {}

    const app = App.create(TestModule, {
      logger: false,
    });

    await app.start();

    expect(hooksInvoked).toBe(2);
  });

  it('should return an imported value', async () => {
    const providers: Provider[] = [
      {
        identifier: 'VALUE_IDENTIFIER',
        useValue: 'testvalue',
      },
    ];

    @Module({
      providers,
      exports: providers,
    })
    class Test1Module {}

    @Module({
      imports: [Test1Module],
    })
    class Test2Module {}

    const app = App.create(Test2Module);
    const testValue = await app.get('VALUE_IDENTIFIER');

    expect(testValue).toBe('testvalue');
  });

  it('should fail to return a value, that was not exported', async () => {
    const providers: Provider[] = [
      {
        identifier: 'VALUE_IDENTIFIER',
        useValue: 'testvalue',
      },
    ];

    @Module({
      providers,
    })
    class Test1Module {}

    @Module({
      imports: [Test1Module],
    })
    class Test2Module {}

    const app = App.create(Test2Module);
    const testValue = app.get('VALUE_IDENTIFIER');

    expect(testValue).rejects.toThrow(
      'No matching bindings found for serviceIdentifier: VALUE_IDENTIFIER',
    );
  });

  it('should return a value', async () => {
    @Module({
      providers: [
        {
          identifier: 'VALUE_IDENTIFIER',
          useValue: 'testvalue',
        },
      ],
    })
    class TestModule {}

    const app = App.create(TestModule);
    const testValue = await app.get('VALUE_IDENTIFIER');

    expect(testValue).toBe('testvalue');
  });

  it('should return an instance of class', async () => {
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
    class TestModule {}

    const app = App.create(TestModule);
    const testValue = await app.get('CLASS_IDENTIFIER');

    expect(testValue).toBeInstanceOf(ClassToInject);
  });

  it('should return a value from factory', async () => {
    @Module({
      providers: [
        {
          identifier: 'FACTORY_IDENTIFIER',
          useFactory: () => {
            return 'factoryvalue';
          },
        },
      ],
    })
    class TestModule {}

    const app = App.create(TestModule);
    const testValue = await app.get('FACTORY_IDENTIFIER');

    expect(testValue).toBe('factoryvalue');
  });

  it('should fail if unkown identifier is provided', async () => {
    @Module()
    class TestModule {}

    const app = App.create(TestModule);
    const testValue = app.get('UNKNOWN_IDENTIFIER');

    expect(testValue).rejects.toThrow(
      'No matching bindings found for serviceIdentifier: UNKNOWN_IDENTIFIER',
    );
  });

  it('should fail to resolve a class that not marked with @Injectable decorator', async () => {
    class TestClass {}

    @Module({
      providers: [TestClass],
    })
    class TestModule {}

    const app = App.create(TestModule);
    const testInstance = app.get(TestClass);

    expect(testInstance).rejects.toThrow(
      'Missing required @injectable annotation in: TestClass.',
    );
  });
});
