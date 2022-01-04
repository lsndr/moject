import * as express from 'express';
import { Provider } from 'moject';

export const EXPRESS_PROVIDER = Symbol('EXPRESS_PROVIDER');

export const expressProvider: Provider = {
  identifier: EXPRESS_PROVIDER,
  useFactory: express,
};
