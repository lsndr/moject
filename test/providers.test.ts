import { Module, App, Injectable } from '../src';

describe('Provider', () => {
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
});
