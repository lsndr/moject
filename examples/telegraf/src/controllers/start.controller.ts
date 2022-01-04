import { Inject, Injectable } from 'moject';
import { TELEGRAF_PROVIDER } from '../providers';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class StartController {
  constructor(@Inject(TELEGRAF_PROVIDER) private readonly telegraf: Telegraf) {
    this.telegraf.command('/start', this.start.bind(this));
  }

  private start(ctx: Context) {
    return ctx.reply(`Hello ${ctx.from?.first_name}!`);
  }
}
