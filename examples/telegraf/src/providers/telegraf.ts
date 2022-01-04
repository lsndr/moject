import { Telegraf } from 'telegraf';
import { Provider } from 'moject';

export const TELEGRAF_PROVIDER = Symbol('EXPRESS_PROVIDER');

export const telegrafProvider: Provider = {
  identifier: TELEGRAF_PROVIDER,
  useFactory: () => new Telegraf(process.env.BOT_TOKEN || ''),
};
