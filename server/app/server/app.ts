import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { HttpStatusCode } from '../../../common/communication/http-status-code.enum';
import { HttpException } from '../classes/http-exception';
import { DatabaseController } from '../controllers/database.controller';
import Types from '../types';

@injectable()
export class Application {
    app = express();

    constructor(@inject(Types.DatabaseController) private databaseController: DatabaseController) {
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
