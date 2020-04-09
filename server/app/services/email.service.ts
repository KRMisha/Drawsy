import { HttpException } from '@app/classes/http-exception';
import { EmailRequest } from '@common/communication/email-request';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        await this.makeEmailValidationRequest(emailRequest);
        await this.sendEmailVerificationRequest(emailRequest);
        await this.sendEmailRequest(emailRequest);
    }

    private async makeEmailValidationRequest(emailRequest: EmailRequest): Promise<void> {
        const formData = this.makeFormData(emailRequest);
        try {
            await this.sendRequest(formData, true, true, false);
        } catch (error) {
            throw new HttpException(HttpStatusCode.BadRequest, "Le courriel envoyé n'est pas valide");
        }
    }

    private async sendEmailVerificationRequest(emailRequest: EmailRequest): Promise<void> {
        const formData = this.makeFormData(emailRequest);
        try {
            await this.sendRequest(formData, true, false, true);
        } catch (error) {
            throw new HttpException(HttpStatusCode.BadRequest, "Le courriel envoyé n'existe pas");
        }
    }

    private async sendEmailRequest(emailRequest: EmailRequest): Promise<void> {
        const formData = this.makeFormData(emailRequest);
        try {
            await this.sendRequest(formData, false, false, false);
        } catch (error) {
            throw new HttpException(HttpStatusCode.BadRequest, "Le courriel n'envoyé pas pu être envoyé");
        }
    }

    private makeFormData(emailRequest: EmailRequest): FormData {
        const form = new FormData();
        form.append('to', emailRequest.address);
        const convertedFile = (emailRequest.drawing as unknown) as Express.Multer.File;
        form.append('payload', convertedFile.buffer, { filename: convertedFile.originalname, contentType: convertedFile.mimetype });
        return form;
    }

    private async sendRequest(form: FormData, isDryRun: boolean, isQuickReturn: boolean, isAddressValidation: boolean): Promise<void> {
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
            await axios.default.post('/email', form, requestConfig);
        } catch (error) {
            throw new HttpException(error.response.status, error.response.data.error);
        }
    }
}
