import { HttpStatusCode } from '@common/communication/http-status-code.enum';

export class HttpException extends Error {
    constructor(
        public status: HttpStatusCode,
        message: string
    ) {
        super(message);
        this.name = 'HttpException';
    }
}
