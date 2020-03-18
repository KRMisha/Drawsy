import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MongoCallback, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { HttpStatusCode } from '../../../common/communication/http-status-code.enum';
import { SavedFile } from '../../../common/communication/saved-file';
import { FileSchema } from '../classes/file-schema';
import { HttpException } from '../classes/http-exception';
import { container } from '../inversify.config';
import Types from '../types';
import { DatabaseService } from './database.service';

// tslint:disable: no-string-literal

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('DatabaseService', () => {
    describe('With active server', () => {
        let mongoServer: MongoMemoryServer;
        let databaseService: DatabaseService;

        before(async () => {
            mongoServer = new MongoMemoryServer();
            const inMemoryServerUrl = await mongoServer.getUri('database');

            const originalConnectFunction = MongoClient.connect;
            sinon
                .stub(MongoClient, 'connect')
                .callsFake((uri: string, options: MongoClientOptions, callback: MongoCallback<MongoClient>): void => {
                    originalConnectFunction(inMemoryServerUrl, options, callback);
                });
        });

        beforeEach((done: Mocha.Done) => {
            databaseService = container.get<DatabaseService>(Types.DatabaseService);

            const waitUntilServerIsConnected = () => {
                if (databaseService['client'] !== undefined) {
                    done();
                } else {
                    const msDelayBetweenChecks = 1;
                    setTimeout(waitUntilServerIsConnected, msDelayBetweenChecks);
                }
            };
            waitUntilServerIsConnected();
        });

        afterEach(async () => {
            await databaseService['collection'].deleteMany({});
            await databaseService.disconnect();
        });

        after(async () => {
            sinon.restore();
            await mongoServer.stop();
        });

        it('should create and connect to a database if it is running', () => {
            expect(databaseService['client']).to.be.ok;
            expect(databaseService['collection']).to.be.ok;
        });

        it('#createFile should throw a 400 error and reject a file with an invalid title', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>!@#</title><desc></desc></svg>';
            await expect(databaseService.createFile(fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'Invalid file')
                .and.have.property('status', HttpStatusCode.BadRequest);
        });

        it('#createFile should throw a 400 error and reject a file with invalid labels', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label,!@#</desc></svg>';
            await expect(databaseService.createFile(fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'Invalid file')
                .and.have.property('status', HttpStatusCode.BadRequest);
        });

        it('#createFile should create a file given a valid title and no labels', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc></desc></svg>';
            const fileId = await databaseService.createFile(fileContent);
            expect(await databaseService['collection'].countDocuments()).to.equal(1);
            expect(await databaseService['collection'].find({ _id: new ObjectId(fileId) }).count()).to.be.greaterThan(0);
        });

        it('#createFile should create a file given a valid title and valid labels', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label1,Label2</desc></svg>';
            const fileId = await databaseService.createFile(fileContent);
            expect(await databaseService['collection'].countDocuments()).to.equal(1);
            expect(await databaseService['collection'].find({ _id: new ObjectId(fileId) }).count()).to.be.greaterThan(0);
        });

        it('#updateFile should throw a 400 error and reject a file with an invalid title', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>!@#</title><desc></desc></svg>';
            await expect(databaseService.updateFile('any_id', fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'Invalid file')
                .and.have.property('status', HttpStatusCode.BadRequest);
        });

        it('#updateFile should throw a 400 error and reject a file with invalid labels', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label,!@#</desc></svg>';
            await expect(databaseService.updateFile('any_id', fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'Invalid file')
                .and.have.property('status', HttpStatusCode.BadRequest);
        });

        it('#updateFile should throw a 404 error for an ID with no associated file', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label1,Label2</desc></svg>';
            const nonexistentId = '5e729d44be114fdb3f37f3ab';
            await expect(databaseService.updateFile(nonexistentId, fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'File not found')
                .and.have.property('status', HttpStatusCode.NotFound);
        });

        it('#updateFile should update the file if its ID is found and its content is valid', async () => {
            const oldFileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label1,Label2</desc></svg>';

            const result = await databaseService['collection'].insertOne({ content: oldFileContent } as FileSchema);
            const fileId = result.insertedId.toHexString();

            const newFileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>NewTitle</title><desc>NewLabel1,NewLabel2</desc></svg>';
            await databaseService.updateFile(fileId, newFileContent);

            const file = await databaseService['collection'].findOne({ _id: new ObjectId(fileId) });
            expect(file).to.be.not.null;
            expect(file!.content).to.equal(newFileContent); // tslint:disable-line: no-non-null-assertion
        });

        it('#deleteFile should throw a 404 error for an ID with no associated file', async () => {
            const nonexistentId = '5e729d44be114fdb3f37f3ab';
            await expect(databaseService.deleteFile(nonexistentId))
                .to.eventually.be.rejectedWith(HttpException, 'File not found')
                .and.have.property('status', HttpStatusCode.NotFound);
        });

        it('#updateFile should delete the file if its ID is found', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title>Title</title><desc>Label1,Label2</desc></svg>';
            const result = await databaseService['collection'].insertOne({ content: fileContent } as FileSchema);
            const fileId = result.insertedId.toHexString();

            expect(await databaseService['collection'].countDocuments()).to.equal(1);
            expect(await databaseService['collection'].find({ _id: new ObjectId(fileId) }).count()).to.be.greaterThan(0);

            await databaseService.deleteFile(fileId);

            expect(await databaseService['collection'].countDocuments()).to.equal(0);
            expect(await databaseService['collection'].find({ _id: new ObjectId(fileId) }).count()).to.not.be.greaterThan(0);
        });

        it('#getFiles should return an empty array if no files have been inserted', async () => {
            const files = await databaseService.getFiles();
            expect(files.length).to.equal(0);
        });

        it('#getFiles should return an array of saved files if files have been inserted', async () => {
            const expectedFiles: SavedFile[] = [];
            const fileCount = 3;
            for (let i = 0; i < fileCount; i++) {
                const fileContent =
                    '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                    `<title>Title${i}</title><desc>Label1,Label2</desc></svg>`;

                const result = await databaseService['collection'].insertOne({ content: fileContent } as FileSchema);
                expectedFiles.push({ id: result.insertedId.toHexString(), content: fileContent } as SavedFile);
            }

            const actualFiles = await databaseService.getFiles();
            expect(actualFiles).to.deep.equal(expectedFiles);
        });
    });

    describe('Without active server', () => {
        before(() => {
            sinon.stub(MongoClient, 'connect').yieldsRight(new Error('TestError'));
        });

        after(() => {
            sinon.restore();
        });

        it('should throw an exception if the connection attempt raises an exception', (done: Mocha.Done) => {
            try {
                new DatabaseService(); // tslint:disable-line: no-unused-expression-chai
            } catch (error) {
                expect(error.message).to.equal('TestError');
                done();
                return;
            }
            done(new Error('Error not thrown'));
        });
    });
});
