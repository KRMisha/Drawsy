import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import EmailValidation from '@common/validation/email-validation';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        if (emailRequest.to === undefined) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Incomplete fields');
        }

        if (!EmailValidation.emailRegex.test(emailRequest.to)) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Invalid email address');
        }

        await this.sendEmailValidationRequest(emailRequest);
        await this.sendEmailRequest(emailRequest);
    }

    private async sendEmailValidationRequest(emailRequest: EmailRequest): Promise<void> {
        try {
            await this.sendRequest(emailRequest, true);
        } catch (error) {
            switch (error.status) {
                case HttpStatusCode.BadRequest:
                    throw new HttpException(HttpStatusCode.BadRequest, 'Email address not found');
                case HttpStatusCode.TooManyRequests:
                    throw new HttpException(HttpStatusCode.TooManyRequests, 'Email limit reached');
                default:
                    throw new HttpException(HttpStatusCode.InternalServerError, error.message);
            }
        }
    }

    private async sendEmailRequest(emailRequest: EmailRequest): Promise<void> {
        try {
            await this.sendRequest(emailRequest, false);
        } catch (error) {
            throw new HttpException(HttpStatusCode.InternalServerError, error.message);
        }
    }

    private async sendRequest(emailRequest: EmailRequest, isAddressValidation: boolean): Promise<AxiosResponse> {
        const form = new FormData();
        form.append('to', emailRequest.to);
        form.append('payload', emailRequest.payload.buffer, {
            filename: emailRequest.payload.originalname,
            contentType: emailRequest.payload.mimetype,
        });

        const config: AxiosRequestConfig = {
            headers: {
                ...form.getHeaders(),
                'X-Team-Key': process.env.EMAIL_API_KEY,
            },
            params: {
                address_validation: isAddressValidation,
                quick_return: isAddressValidation,
                dry_run: isAddressValidation,
            },
        };

        if (process.env.EMAIL_API_URL !== undefined) {
            try {
                return await axios.post(process.env.EMAIL_API_URL, form, config);
            } catch (error) {
                throw new HttpException(error.response.status, error.response.data.error ?? 'Email API error');
            }
        } else {
            throw new HttpException(HttpStatusCode.InternalServerError, 'Invalid email endpoint');
        }
    }
}
