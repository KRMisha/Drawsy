import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { HttpException } from '../classes/http-exception';
import { HttpStatusCode } from '../classes/http-status-code.enum';
import { DatabaseController } from '../controllers/database.controller';
import { DateController } from '../controllers/date.controller';
import { IndexController } from '../controllers/index.controller';
import Types from '../types';

@injectable()
export class Application {
    app = express();

    constructor(
        @inject(Types.DatabaseController) private databaseController: DatabaseController,
        @inject(Types.IndexController) private indexController: IndexController,
        @inject(Types.DateController) private dateController: DateController,
    ) {
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private setupMiddleware(): void {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    private setupRoutes(): void {
        this.app.use('/api', this.databaseController.router);
        this.app.use('/api/index', this.indexController.router);
        this.app.use('/api/date', this.dateController.router);
    }

    private setupErrorHandler(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            next(new HttpException(HttpStatusCode.NotFound, 'Not Found'));
        });

        this.app.use((err: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(err.status || HttpStatusCode.InternalServerError).send({ message: err.message });
        });
    }
}
