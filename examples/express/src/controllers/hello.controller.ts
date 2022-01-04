import { Inject, Injectable } from 'moject';
import { EXPRESS_PROVIDER } from '../providers';
import { Express, Request, Response } from 'express';

@Injectable()
export class HelloController {
  constructor(@Inject(EXPRESS_PROVIDER) private readonly express: Express) {
    this.express.get('/', this.hello.bind(this));
    this.express.get('/hello', this.hello.bind(this));
  }

  private hello(req: Request, res: Response) {
    res.send('Hello world');
  }
}
