import { HttpException } from '@app/classes/http-exception';
import { DatabaseController } from '@app/controllers/database.controller';
import { EmailController } from '@app/controllers/email.controller';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';

@injectable()
export class Application {
    app = express();

    constructor(
        @inject(Types.DatabaseController) private databaseController: DatabaseController,
        @inject(Types.EmailController) private emailController: EmailController
    ) {
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private setupMiddleware(): void {
        this.app.use(logger(this.app.get('env') === 'development' ? 'dev' : 'tiny'));
        this.app.use(express.json({ limit: '16mb' }));
        this.app.use(express.urlencoded({ limit: '16mb', extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(helmet());
    }

    private setupRoutes(): void {
        this.app.use('/api', this.databaseController.router);
        this.app.use('/api', this.emailController.router);
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
