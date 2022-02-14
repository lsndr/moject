import { Module, App, Provider } from '../src';

describe('Import/Export', () => {
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
});
