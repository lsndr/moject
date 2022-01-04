import { Inject, Injectable } from 'moject';
import { EXPRESS_PROVIDER } from '../providers';
import { Express, Request, Response } from 'express';

@Injectable()
export class ByeController {
  constructor(@Inject(EXPRESS_PROVIDER) private readonly express: Express) {
    this.express.get('/bye', this.bye.bind(this));
  }

  private bye(req: Request, res: Response) {
    res.send('Bye-bye');
  }
}
