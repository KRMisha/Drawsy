import { EmailRequest } from '@app/classes/email-request';
import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { Application } from '@app/server/app';
import { DatabaseService } from '@app/services/database.service';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as chai from 'chai';
import * as multer from 'multer';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as supertest from 'supertest';

chai.use(sinonChai);
const expect = chai.expect;

describe('EmailController', () => {
    let app: Express.Application;
    let emailService: sinon.SinonStubbedInstance<EmailService>;

    beforeEach(() => {
        container.snapshot();
        container
            .rebind<sinon.SinonStubbedInstance<EmailService>>(Types.EmailService)
            .toConstantValue(sinon.createStubInstance(EmailService));
        container
            .rebind<sinon.SinonStubbedInstance<DatabaseService>>(Types.DatabaseService)
            .toConstantValue(sinon.createStubInstance(DatabaseService));
        app = container.get<Application>(Types.Application).app;
        emailService = container.get<sinon.SinonStubbedInstance<EmailService>>(Types.EmailService);
    });

    afterEach(() => {
        sinon.restore();
        container.restore();
    });

    it('should create', () => {
        expect(emailService).to.be.ok;
    });

    it('#post /api/send-email should return valid status code when the service succeeds', async () => {
        const emailRequest = ({ to: 'samer', payload: undefined } as unknown) as EmailRequest;
        await supertest(app).post('/api/send-email').send(emailRequest).expect(HttpStatusCode.Ok);
        expect(emailService.sendEmail).to.have.been.calledWith(emailRequest);
    });

    it('#post /api/send-email should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        emailService.sendEmail.rejects(error);

        const emailRequest = ({ to: 'samer', payload: undefined } as unknown) as EmailRequest;
        const response = await supertest(app).post('/api/send-email').send(emailRequest).expect(HttpStatusCode.ImATeapot);
        expect(emailService.sendEmail).to.have.been.calledWith(emailRequest);
        expect(response.body.message).to.equal(error.message);
    });

    // tslint:disable-next-line: max-line-length
    it("#post /api/send-email should return PayloadTooLarge when the the error is an instance of MulterError 'LIMIT_FILE_SIZE'", async () => {
        const error = new multer.MulterError('LIMIT_FILE_SIZE', 'message');
        emailService.sendEmail.rejects(error);

        const emailRequest = ({ to: 'samer', payload: undefined } as unknown) as EmailRequest;
        const response = await supertest(app).post('/api/send-email').send(emailRequest).expect(HttpStatusCode.InternalServerError);
        expect(emailService.sendEmail).to.have.been.calledWith(emailRequest);
        expect(response.body.message).to.equal(error.message);
    });

    it("#post /api/send-email should return BadRequest when the the error is an instance of MulterError 'LIMIT_FIELD_COUNT'", async () => {
        const error = new multer.MulterError('LIMIT_FIELD_COUNT', 'Too many fields');
        emailService.sendEmail.rejects(error);

        const response = await supertest(app)
            .post('/api/send-email')
            .field('toa', 'samer')
            .field('toae', 'samer2')
            .expect(HttpStatusCode.BadRequest);
        expect(response.body.message).to.equal(error.message);
    });
});
