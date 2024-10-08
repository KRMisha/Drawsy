import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import * as multer from 'multer';

const upload = multer({
    limits: {
        fields: 1,
        fileSize: 8388608,
        files: 1,
    },
}).single('payload');

@injectable()
export class EmailController {
    router = Router();

    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/send-email', (req: Request, res: Response, next: NextFunction) => {
            upload(req, res, async (error: unknown) => {
                if (error instanceof multer.MulterError) {
                    let status: HttpStatusCode;
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            status = HttpStatusCode.PayloadTooLarge;
                            break;
                        case 'LIMIT_FIELD_COUNT':
                        case 'LIMIT_FILE_COUNT':
                        case 'LIMIT_UNEXPECTED_FILE':
                        default:
                            status = HttpStatusCode.BadRequest;
                            break;
                    }
                    return next(new HttpException(status, error.message));
                }

                try {
                    const emailRequest: EmailRequest = {
                        to: req.body.to,
                        payload: req.file!, // tslint:disable-line: no-non-null-assertion
                    };
                    await this.emailService.sendEmail(emailRequest);
                    res.status(HttpStatusCode.Ok).end();
                } catch (error) {
                    return next(error);
                }
            });
        });
    }
}
