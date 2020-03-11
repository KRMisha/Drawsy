import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { Message } from '../../../common/communication/message';
import { IndexService } from '../services/index.service';
import Types from '../types';

@injectable()
export class IndexController {
    router = Router();

    constructor(@inject(Types.IndexService) private indexService: IndexService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const time: Message = await this.indexService.helloWorld();
            res.json(time);
        });

        this.router.get('/about', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            res.json(this.indexService.about());
        });
    }
}
