import { HttpException } from '@app/classes/http-exception';
import { container } from '@app/inversify.config';
import { Application } from '@app/server/app';
import { DatabaseService } from '@app/services/database.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileContent } from '@common/communication/new-file-content';
import { SavedFile } from '@common/communication/saved-file';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as supertest from 'supertest';

chai.use(sinonChai);
const expect = chai.expect;

describe('DatabaseController', () => {
    const newFileContent: NewFileContent = {
        content:
            '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
            '<title>Title</title><desc>Label1,Label2</desc></svg>',
    };
    const fileId = '5e72c22ec84f93ed6dc389e6';

    let app: Express.Application;
    let databaseService: sinon.SinonStubbedInstance<DatabaseService>;

    beforeEach(() => {
        container.snapshot();
        container
            .rebind<sinon.SinonStubbedInstance<DatabaseService>>(Types.DatabaseService)
            .toConstantValue(sinon.createStubInstance(DatabaseService));
        app = container.get<Application>(Types.Application).app;
        databaseService = container.get<sinon.SinonStubbedInstance<DatabaseService>>(Types.DatabaseService);
    });

    afterEach(() => {
        sinon.restore();
        container.restore();
    });

    it('#post /api/create should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        databaseService.createFile.rejects(error);

        const response = await supertest(app)
            .post('/api/create')
            .send(newFileContent)
            .expect(HttpStatusCode.ImATeapot);
        expect(databaseService.createFile).to.have.been.calledWith(newFileContent.content);
        expect(response.body.message).to.equal(error.message);
    });

    it('#post /api/create should return the newly created file ID when the service succeeds', async () => {
        databaseService.createFile.resolves(fileId);

        const response = await supertest(app)
            .post('/api/create')
            .send(newFileContent)
            .expect(HttpStatusCode.Created);
        expect(databaseService.createFile).to.have.been.calledWith(newFileContent.content);
        expect(response.body.id).to.equal(fileId);
    });

    it('#put /api/update should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        databaseService.updateFile.rejects(error);

        const response = await supertest(app)
            .put('/api/update/' + fileId)
            .send(newFileContent)
            .expect(HttpStatusCode.ImATeapot);
        expect(databaseService.updateFile).to.have.been.calledWith(fileId, newFileContent.content);
        expect(response.body.message).to.equal(error.message);
    });

    it('#put /api/update should return a valid status code when the service succeeds', async () => {
        await supertest(app)
            .put('/api/update/' + fileId)
            .send(newFileContent)
            .expect(HttpStatusCode.Ok);
        expect(databaseService.updateFile).to.have.been.calledWith(fileId, newFileContent.content);
    });

    it('#delete /api/delete should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        databaseService.deleteFile.rejects(error);

        const response = await supertest(app)
            .delete('/api/delete/' + fileId)
            .expect(HttpStatusCode.ImATeapot);
        expect(databaseService.deleteFile).to.have.been.calledWith(fileId);
        expect(response.body.message).to.equal(error.message);
    });

    it('#delete /api/delete should return a valid status code when the service succeeds', async () => {
        await supertest(app)
            .delete('/api/delete/' + fileId)
            .expect(HttpStatusCode.NoContent);
        expect(databaseService.deleteFile).to.have.been.calledWith(fileId);
    });

    it('#get /api/get-all should return the error and status code when the service fails', async () => {
        const error = new HttpException(HttpStatusCode.ImATeapot, 'Message');
        databaseService.getFiles.rejects(error);

        const response = await supertest(app)
            .get('/api/get-all')
            .expect(HttpStatusCode.ImATeapot);
        expect(databaseService.getFiles).to.have.been.called;
        expect(response.body.message).to.equal(error.message);
    });

    it('#delete /api/get-all should return an array of files when the service succeeds', async () => {
        const expectedFiles: SavedFile[] = [];
        const fileCount = 3;
        for (let i = 0; i < fileCount; i++) {
            const uniqueFileId = `5e72c22ec84f93ed6dc389e${i}`;
            const uniqueFileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                `<title>Title${i}</title><desc>Label1,Label2</desc></svg>`;
            expectedFiles.push({ id: uniqueFileId, content: uniqueFileContent } as SavedFile);
        }

        databaseService.getFiles.resolves(expectedFiles);

        const response = await supertest(app)
            .get('/api/get-all')
            .expect(HttpStatusCode.Ok);
        expect(databaseService.getFiles).to.have.been.called;
        expect(response.body).to.deep.equal(expectedFiles);
    });
});
