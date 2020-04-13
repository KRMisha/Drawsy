import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import EmailValidation from '@common/validation/email-validation';
import * as axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        if (emailRequest.to === undefined) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Incomplete fields');
        }

        if (!EmailValidation.emailRegex.test(emailRequest.to)) {
            throw new HttpException(HttpStatusCode.BadRequest, 'Invalid email');
        }

        await this.sendEmailValidationRequest(emailRequest);
        await this.sendEmailRequest(emailRequest);
    }

    private async sendEmailValidationRequest(emailRequest: EmailRequest): Promise<void> {
        try {
            await this.sendRequest(emailRequest, true);
        } catch (error) {
            if (error.status === HttpStatusCode.BadRequest) {
                throw new HttpException(HttpStatusCode.BadRequest, 'Email not found');
            } else {
                throw new HttpException(HttpStatusCode.InternalServerError, error.message);
            }
        }
    }

    private async sendEmailRequest(emailRequest: EmailRequest): Promise<void> {
        try {
            await this.sendRequest(emailRequest, false);
        } catch (error) {
            if (error.status === HttpStatusCode.TooManyRequests) {
                throw new HttpException(HttpStatusCode.TooManyRequests, 'Email limit reached');
            } else {
                throw new HttpException(HttpStatusCode.InternalServerError, error.message);
            }
        }
    }

    private async sendRequest(emailRequest: EmailRequest, isAddressValidation: boolean): Promise<axios.AxiosResponse> {
        const form = new FormData();
        form.append('to', emailRequest.to);
        form.append('payload', emailRequest.payload.buffer, {
            filename: emailRequest.payload.originalname,
            contentType: emailRequest.payload.mimetype,
        });

        const config: axios.AxiosRequestConfig = {
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
                return await axios.default.post(process.env.EMAIL_API_URL, form, config);
            } catch (error) {
                throw new HttpException(error.response.status, error.response.data.error ?? 'Email API error');
            }
        } else {
            throw new HttpException(HttpStatusCode.InternalServerError, 'Invalid email endpoint');
        }
    }
}
