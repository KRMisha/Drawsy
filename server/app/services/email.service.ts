import { HttpException } from '@app/classes/http-exception';
import { EmailRequest } from '@common/communication/email-request';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        if (emailRequest.drawing === undefined || emailRequest.address === undefined) {
            throw new HttpException(HttpStatusCode.BadRequest, 'La requete est incomplète');
        }
        try {
            await this.makeEmailValidationRequest(emailRequest);
            await this.sendEmailVerificationRequest(emailRequest);
            await this.sendEmailRequest(emailRequest);
        } catch (error) {
            switch (error.status) {
                case HttpStatusCode.Forbidden:
                case HttpStatusCode.UnprocessableEntity:
                    throw new HttpException(HttpStatusCode.InternalServerError, 'Un problème interne est survenu');
                    break;
                case HttpStatusCode.TooManyRequests:
                    throw new HttpException(HttpStatusCode.InternalServerError, "Vous avez dépasser votre limite de d'envois de couriels");
                    break;
                default:
                    throw error;
                    break;
            }
        }
    }

    private async makeEmailValidationRequest(emailRequest: EmailRequest): Promise<void> {
        const formData = this.makeFormData(emailRequest);
        try {
            await this.sendRequest(formData, false, true, false);
        } catch (error) {
            if (error.status === HttpStatusCode.BadRequest) {
                throw new HttpException(HttpStatusCode.BadRequest, "Le courriel envoyé n'est pas valide");
            } else {
                throw error;
            }
        }
    }

    private async sendEmailVerificationRequest(emailRequest: EmailRequest): Promise<void> {
        const formData = this.makeFormData(emailRequest);
        try {
            await this.sendRequest(formData, false, false, true);
        } catch (error) {
            if (error.status === HttpStatusCode.BadRequest) {
                throw new HttpException(HttpStatusCode.BadRequest, "L'adresse courriel envoyé n'existe pas");
            } else {
                throw error;
            }
        }
    }

    private async sendEmailRequest(emailRequest: EmailRequest): Promise<number> {
        const formData = this.makeFormData(emailRequest);
        try {
            const requestReponse = await this.sendRequest(formData, false, false, false);
            return parseInt(requestReponse.headers['x-ratelimit-remaining'], 10);
        } catch (error) {
            if (error.status === HttpStatusCode.BadRequest) {
                throw new HttpException(HttpStatusCode.BadRequest, "Le courriel n'envoyé pas pu être envoyé");
            } else {
                throw error;
            }
        }
    }

    private makeFormData(emailRequest: EmailRequest): FormData {
        const form = new FormData();
        form.append('to', emailRequest.address);
        const convertedFile = (emailRequest.drawing as unknown) as Express.Multer.File;
        form.append('payload', convertedFile.buffer, { filename: convertedFile.originalname, contentType: convertedFile.mimetype });
        return form;
    }

    private async sendRequest(
        form: FormData,
        isDryRun: boolean,
        isQuickReturn: boolean,
        isAddressValidation: boolean
    ): Promise<axios.AxiosResponse> {
        const requestConfig = {
            baseURL: 'https://log2990.step.polymtl.ca',
            headers: {
                'X-team-key': process.env.EMAIL_API_KEY,
                ...form.getHeaders(),
            },
            params: {
                dry_run: isDryRun,
                quick_return: isQuickReturn,
                address_validation: isAddressValidation,
            },
        } as axios.AxiosRequestConfig;

        try {
            return await axios.default.post('/email', form, requestConfig);
        } catch (error) {
            throw new HttpException(error.response.status, error.response.data.error);
        }
    }
}
