import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailController {
    router = Router();

    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post(
            '/send-email',
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    // await this.emailService.sendEmail(req.body.emailAddress, /* Get file attachment from request */);
                    res.status(HttpStatusCode.Ok).end();
                } catch (error) {
                    return next(error);
                }
            }
        );
    }
}
