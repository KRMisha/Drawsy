import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import axios from 'axios';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('EmailService', () => {
    const payloadStub = {
        buffer: 'lool',
        originalname: 'mishaWithoutFilters',
        mimetype: 'xd/xml',
    } as unknown as Express.Multer.File;

    let emailService: EmailService;

    beforeEach(() => {
        emailService = container.get<EmailService>(Types.EmailService);
        process.env.EMAIL_API_URL = 'drawsy.io';
    });

    afterEach(() => {
        sinon.restore();
    });

    it('#should create', () => {
        expect(emailService).to.be.ok;
    });

    it("#sendEmail should throw BadRequest if 'to' field is undefined", async () => {
        const emailRequest = { to: undefined, payload: undefined } as unknown as EmailRequest;
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, 'Incomplete fields')
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });

    it('#sendEmail should throw BadRequest if the email address is invalid', async () => {
        const emailRequest = { to: 'undefined', payload: undefined } as unknown as EmailRequest;
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, 'Invalid email address')
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });

    it('#sendEmail should throw BadRequest if the API response is BadRequest', async () => {
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        const expectedErrorMessage = 'Email address not found';
        const errorStub = {
            response: {
                status: HttpStatusCode.BadRequest,
                data: {
                    error: expectedErrorMessage,
                },
            },
        };
        sinon.stub(axios, 'post').throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, expectedErrorMessage)
            .and.to.have.property('status', HttpStatusCode.BadRequest);
    });

    it('#sendEmail should throw TooManyRequest if the API response is TooManyRequests', async () => {
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        const expectedErrorMessage = 'Email limit reached';
        const errorStub = {
            response: {
                status: HttpStatusCode.TooManyRequests,
                data: {
                    error: expectedErrorMessage,
                },
            },
        };
        sinon.stub(axios, 'post').throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, expectedErrorMessage)
            .and.to.have.property('status', HttpStatusCode.TooManyRequests);
    });

    it("#sendEmail should throw InternalServerError if the validation's response is other than BadRequest or TooManyRequests", async () => {
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        const expectedErrorMessage = 'Je suis une théière';
        const errorStub = {
            response: {
                status: HttpStatusCode.ImATeapot,
                data: {
                    error: expectedErrorMessage,
                },
            },
        };
        sinon.stub(axios, 'post').throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, expectedErrorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });

    it('#sendEmail should throw InternalServerError if the API returns an error on sendEmailRequest', async () => {
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        const expectedErrorMessage = 'Email API error';
        const errorStub = {
            response: {
                status: HttpStatusCode.ImATeapot,
                data: {
                    error: undefined,
                },
            },
        };
        sinon.stub(axios, 'post').onSecondCall().throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, expectedErrorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });

    it('#sendEmail should throw InternalServerError if the EMAIL_API_URL environnement variable is undefined', async () => {
        delete process.env.EMAIL_API_URL;
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        const expectedErrorMessage = 'Invalid email endpoint';
        const errorStub = {
            response: {
                status: HttpStatusCode.InternalServerError,
                data: {
                    error: expectedErrorMessage,
                },
            },
        };
        sinon.stub(axios, 'post').onSecondCall().throws(errorStub);
        await expect(emailService.sendEmail(emailRequest))
            .to.eventually.be.rejectedWith(HttpException, expectedErrorMessage)
            .and.to.have.property('status', HttpStatusCode.InternalServerError);
    });

    it('#sendEmail should return without throwing errors if the request was successfully completed', async () => {
        const emailRequest: EmailRequest = { to: 'drawsy.io@hosted.com', payload: payloadStub };
        sinon.stub(axios, 'post').resolves();
        await expect(emailService.sendEmail(emailRequest)).to.not.throw;
    });
});
