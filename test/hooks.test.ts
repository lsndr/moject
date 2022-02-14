import { Module, App, Injectable } from '../src';

describe('Hooks', () => {
  it('should be invoked', async () => {
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
});
