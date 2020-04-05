import { HttpException } from '@app/classes/http-exception';
import { EmailRequest } from '@common/communication/email-request';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import EmailValidation from '@common/validation/email-validation';
import * as http from 'http';
import * as https from 'https';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        if (!this.isEmailValid(emailRequest.address)) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Email address invalid');
        } else {
            try {
                const validationRequest = await this.makeValidationRequest(emailRequest);
                if (validationRequest === HttpStatusCode.Ok) {
                    const fullRequest = await this.makeFullRequest(emailRequest);
                        if(fullRequest !== HttpStatusCode.Ok) {
                            console.log('What');
                        }
                }
            } catch {
                throw new HttpException(HttpStatusCode.BadRequest, 'Email address invalid');
            }
        }
    }

    private isEmailValid(address: string): boolean {
        return EmailValidation.emailRegex.exec(address) !== undefined;
    }

    private async makeValidationRequest(emailRequest: EmailRequest): Promise<HttpStatusCode> {
        const requestOptions = {
            method: 'get',
            hostname: 'https://log2990.step.polymtl.ca ',
            path: '/email',
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Team-Key': '',
            },
        };

        const requestResponse = await this.makeRequest(requestOptions);
        if (requestResponse.statusCode !== HttpStatusCode.Ok) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Email address invalid');
        }

        return requestResponse.statusCode;
    }

    private async makeFullRequest(emailRequest: EmailRequest): Promise<HttpStatusCode> {
        const requestOptions = {
            method: 'get',
            hostname: 'https://log2990.step.polymtl.ca ',
            path: '/email',
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Team-Key': '',
            },
        };

        const requestResponse = await this.makeRequest(requestOptions);
        if (requestResponse.statusCode !== HttpStatusCode.Ok) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Email address invalid');
        }

        return requestResponse.statusCode;
    }

    private async makeRequest(requestOptions: https.RequestOptions): Promise<http.IncomingMessage> {
        return new Promise<http.IncomingMessage>((resolve: (response: http.IncomingMessage) => void): void => {
            const request = https.request(requestOptions, );
            request.on('error', (error: Error) => {
                throw error;
            });
            request.on('response', (requestReponse: http.IncomingMessage) => {
                resolve(requestReponse);
            });
            request.end();
        });
    }
}
