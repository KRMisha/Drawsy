import { injectable } from 'inversify';
import { JSDOM } from 'jsdom';
import { Collection, MongoClient, MongoClientOptions, MongoError, ObjectId } from 'mongodb';
import { FileSchema } from '../classes/file-schema';
import { HttpException } from '../classes/http-exception';
import { HttpStatusCode } from '../classes/http-status-code.enum';

const connectionUrl = 'mongodb+srv://htmales:lLOKpwsJzmaoSitj@log2990-toreo.mongodb.net/test?retryWrites=true&w=majority';
const databaseName = 'database';
const collectionName = 'images';

const descRegex = /[\w ]+/;

@injectable()
export class DatabaseService {
    private collection: Collection<FileSchema>;

    constructor() {
        const options: MongoClientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        MongoClient.connect(connectionUrl, options, (error: MongoError, client: MongoClient): void => {
            if (error) {
                throw error;
            }

            this.collection = client.db(databaseName).collection(collectionName);
        });
    }

    async createFile(fileContent: string): Promise<string> {
        if (this.isFileValid(fileContent)) {
            const result = await this.collection.insertOne({ content: fileContent } as FileSchema);
            return result.insertedId.toHexString();
        }
        throw new HttpException(HttpStatusCode.BadRequest, 'Invalid file');
    }

    async updateFile(fileId: string, fileContent: string): Promise<void> {
        if (this.isFileValid(fileContent)) {
            const result = await this.collection.replaceOne({ _id: new ObjectId(fileId) }, { content: fileContent } as FileSchema);
            if (result.matchedCount === 0) {
                throw new HttpException(HttpStatusCode.NotFound, 'File not found');
            }
        } else {
            throw new HttpException(HttpStatusCode.BadRequest, 'Invalid file');
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(fileId) });
        if (result.deletedCount === 0) {
            throw new HttpException(HttpStatusCode.NotFound, 'File not found');
        }
    }

    async getFiles(): Promise<FileSchema[]> {
        return await this.collection.find().toArray();
    }

    private isFileValid(fileContent: string): boolean {
        const dom = new JSDOM(fileContent);
        const drawingRoot = dom.window.document.getElementsByTagName('svg')[0];

        const title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
        const labels = drawingRoot.getElementsByTagName('desc')[0].innerHTML.split(',');

        return this.isTitleValid(title) && this.areLabelsValid(labels);
    }

    private isTitleValid(title: string): boolean {
        return descRegex.test(title);
    }

    private areLabelsValid(labels: string[]): boolean {
        return labels.every((label: string) => descRegex.test(label));
    }
}
