import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { Application } from '@app/server/app';
import { DatabaseService } from '@app/services/database.service';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as chai from 'chai';
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

    it('#post /api/send-email should return a valid status code when the service succeeds', async () => {
        emailService.sendEmail.resolves();

        await supertest(app).post('/api/send-email').field('to', 'samer').attach('payload', 'test/svg-logo.png').expect(HttpStatusCode.Ok);
        expect(emailService.sendEmail).to.have.been.called;
    });

    it('#post /api/send-email should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        emailService.sendEmail.rejects(error);

        const response = await supertest(app)
            .post('/api/send-email')
            .field('to', 'samer')
            .attach('payload', 'test/svg-logo.png')
            .expect(HttpStatusCode.ImATeapot);
        expect(emailService.sendEmail).to.have.been.called;
        expect(response.body.message).to.equal(error.message);
    });

    // tslint:disable-next-line: max-line-length
    it("#post /api/send-email should return PayloadTooLarge when the the error is an instance of MulterError 'LIMIT_FILE_SIZE'", async () => {
        const expectedErrorMessage = 'File too large';

        const response = await supertest(app)
            .post('/api/send-email')
            .field('to', 'samer')
            .attach('payload', 'test/pizigani-chart.jpeg')
            .expect(HttpStatusCode.PayloadTooLarge);
        expect(response.body.message).to.equal(expectedErrorMessage);
    });

    it("#post /api/send-email should return BadRequest when the the error is an instance of MulterError 'LIMIT_FIELD_COUNT'", async () => {
        const expectedErrorMessage = 'Too many fields';

        const response = await supertest(app)
            .post('/api/send-email')
            .field('to1', 'samer1')
            .field('to2', 'samer2')
            .expect(HttpStatusCode.BadRequest);
        expect(response.body.message).to.equal(expectedErrorMessage);
    });

    it("#post /api/send-email should return BadRequest when the the error is an instance of MulterError 'LIMIT_FILE_COUNT'", async () => {
        const expectedErrorMessage = 'Too many files';

        const response = await supertest(app)
            .post('/api/send-email')
            .attach('payload', 'test/svg-logo.png')
            .attach('payload', 'test/svg-logo.png')
            .expect(HttpStatusCode.BadRequest);
        expect(response.body.message).to.equal(expectedErrorMessage);
    });

    // tslint:disable-next-line: max-line-length
    it("#post /api/send-email should return BadRequest when the the error is an instance of MulterError 'LIMIT_UNEXPECTED_FILE'", async () => {
        const expectedErrorMessage = 'Unexpected field';

        const response = await supertest(app)
            .post('/api/send-email')
            .field('to', 'samer')
            .attach('miam', 'test/svg-logo.png')
            .expect(HttpStatusCode.BadRequest);
        expect(response.body.message).to.equal(expectedErrorMessage);
    });
});
