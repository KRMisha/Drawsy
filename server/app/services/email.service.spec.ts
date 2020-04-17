import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as axios from 'axios';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

chai.use(chaiAsPromised);
const expect = chai.expect;

const payloadStub = {
    buffer: 'lool',
    originalname: 'mishaWithoutFilters',
    mimetype: 'xml/Xd',
};

describe('EmailService', () => {
    let emailService: EmailService;

    before(() => {
        process.env.EMAIL_API_URL = 'drawsy.io';
    });

    beforeEach(() => {
        emailService = container.get<EmailService>(Types.EmailService);
    });

    afterEach(() => {
        sinon.restore();
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

    it('#sendEmail should throw BadRequest if the API response is BadRequest', async () => {
        const emailRequest = ({ to: 'drawsy.io@hosted.com', payload: payloadStub } as unknown) as EmailRequest;
        const errorMessage = 'Email address not found';
        const errorStub = {
            response: {
                status: HttpStatusCode.BadRequest,
                data:{
                    error: errorMessage,
                },
            },
        };
        sinon.stub(axios.default, 'post').throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, errorMessage)
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });

    it("#sendEmail should throw InternalServerError if the validation's response is different from BadRequest", async () => {
        const emailRequest = ({ to: 'drawsy.io@hosted.com', payload: payloadStub } as unknown) as EmailRequest;
        const errorMessage = 'Penis';
        const errorStub = {
            response: {
                status: HttpStatusCode.ImATeapot,
                data:{
                    error: errorMessage,
                },
            },
        };
        sinon.stub(axios.default, 'post').throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, errorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });

    it('#sendEmail should throw TooManyRequest if the API response is TooManyRequests', async () => {
        const emailRequest = ({ to: 'drawsy.io@hosted.com', payload: payloadStub } as unknown) as EmailRequest;
        const errorMessage = 'Email limit reached';
        const errorStub = {
            response: {
                status: HttpStatusCode.TooManyRequests,
                data:{
                    error: errorMessage,
                },
            },
        };
        sinon.stub(axios.default, 'post').onSecondCall().throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, errorMessage)
            .and.to.have.property('status', HttpStatusCode.TooManyRequests);
    });

    it('#sendEmail should throw InternalServerError if the API response is different from TooManyRequest', async () => {
        const emailRequest = ({ to: 'drawsy.io@hosted.com', payload: payloadStub } as unknown) as EmailRequest;
        const errorMessage = 'Email API error';
        const errorStub = {
            response: {
                status: HttpStatusCode.InternalServerError,
                data: {
                    error: undefined,
                },
            },
        };
        sinon.stub(axios.default, 'post').onSecondCall().throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, errorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });

    it('#sendEmail should throw InternalServerError if the API response is different from TooManyRequest', async () => {
        delete process.env.EMAIL_API_URL;
        const emailRequest = ({ to: 'drawsy.io@hosted.com', payload: payloadStub } as unknown) as EmailRequest;
        const errorMessage = 'Invalid email endpoint';
        const errorStub = {
            response: {
                status: HttpStatusCode.InternalServerError,
                data:{
                    error: errorMessage,
                },
            },
        };
        sinon.stub(axios.default, 'post').onSecondCall().throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, errorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });
});
