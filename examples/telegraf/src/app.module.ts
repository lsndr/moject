import { Inject, Module } from 'moject';
import { StartController } from './controllers';
import { telegrafProvider, TELEGRAF_PROVIDER } from './providers';
import { Telegraf } from 'telegraf';

@Module({
  hooks: [StartController],
  providers: [telegrafProvider],
})
export class AppModule {
  constructor(@Inject(TELEGRAF_PROVIDER) private readonly telegraf: Telegraf) {}

  afterInit() {
    return this.telegraf.launch();
  }
}
