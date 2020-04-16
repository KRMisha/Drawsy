import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('EmailService', () => {
    let emailService: EmailService;

    beforeEach(() => {
        emailService = container.get<EmailService>(Types.EmailService);
    });

    it('#should create', () => {
        expect(emailService).to.be.ok;
    });

    it("#sendEmail should throw BadRequest if 'to' field is undefined", async () => {
        const emailRequest = ({ to: undefined, payload: undefined } as unknown) as EmailRequest;
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, 'Incomplete fields')
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });

    it('#sendEmail should throw BadRequest if emailAdress is invalid', async () => {
        const emailRequest = ({ to: 'undefined', payload: undefined } as unknown) as EmailRequest;
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, 'Invalid email address')
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });
});
