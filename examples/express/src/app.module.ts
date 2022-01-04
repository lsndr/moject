import { Inject, Module } from 'moject';
import { ByeController, HelloController } from './controllers';
import { expressProvider, EXPRESS_PROVIDER } from './providers';
import { Express } from 'express';

@Module({
  hooks: [HelloController, ByeController],
  providers: [expressProvider],
})
export class AppModule {
  constructor(@Inject(EXPRESS_PROVIDER) private readonly express: Express) {}

  async afterInit() {
    return new Promise<void>((resolve) => {
      this.express.listen(80, () => {
        resolve();
      });
    });
  }
}
