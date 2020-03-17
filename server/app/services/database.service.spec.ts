import { expect } from 'chai';
import { MongoCallback, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { container } from '../inversify.config';
import Types from '../types';
import { DatabaseService } from './database.service';

// tslint:disable: no-string-literal

describe('DatabaseService', () => {
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

    // it('should create and throw an exception if no database is running', () => {
    //     expect(databaseService['client']).to.be.ok;
    //     expect(databaseService['collection']).to.be.ok;
    // });

    // it('#createFile should reject a file with an invalid title', () => {});
});
