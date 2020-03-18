import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MongoCallback, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { HttpStatusCode } from '../../../common/communication/http-status-code.enum';
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
            sinon.stub(MongoClient, 'connect')
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
            await databaseService.closeConnection();
        });

        after(async () => {
            sinon.restore();
            await mongoServer.stop();
        });

        it('should create and connect to a database if it is running', () => {
            expect(databaseService['client']).to.be.ok;
            expect(databaseService['collection']).to.be.ok;
        });

        it('#createFile should reject a file with an invalid title', async () => {
            const fileContent =
                '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 800">' +
                '<title></title><desc></desc></svg>';
            await expect(databaseService.createFile(fileContent))
                .to.eventually.be.rejectedWith(HttpException, 'Invalid file')
                .and.have.property('status', HttpStatusCode.BadRequest);
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
