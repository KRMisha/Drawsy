import { FileSchema } from '@app/classes/file-schema';
import { HttpException } from '@app/classes/http-exception';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import { descRegex } from '@common/validation/desc-regex';
import { injectable } from 'inversify';
import { JSDOM } from 'jsdom';
import { Collection, MongoClient, MongoClientOptions, MongoError, ObjectId } from 'mongodb';

const connectionUrl = 'mongodb+srv://htmales:lLOKpwsJzmaoSitj@log2990-toreo.mongodb.net/test?retryWrites=true&w=majority';
const databaseName = 'database';
const collectionName = 'drawings';

@injectable()
export class DatabaseService {
    private client: MongoClient;
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

            this.client = client;
            this.collection = client.db(databaseName).collection(collectionName);
        });
    }

    async disconnect(): Promise<void> {
        await this.client.close();
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

    async getFiles(): Promise<SavedFile[]> {
        const collection = await this.collection.find().toArray();
        const convertSchemaToSavedFile = (element: FileSchema & { _id: ObjectId }) =>
            ({ id: element._id.toString(), content: element.content } as SavedFile);
        return collection.map(convertSchemaToSavedFile);
    }

    private isFileValid(fileContent: string): boolean {
        const dom = new JSDOM(fileContent);
        const drawingRoot = dom.window.document.getElementsByTagName('svg')[0];

        const title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
        const labels = drawingRoot.getElementsByTagName('desc')[0].innerHTML;

        return this.isTitleValid(title) && this.areLabelsValid(labels);
    }

    private isTitleValid(title: string): boolean {
        return descRegex.test(title);
    }

    private areLabelsValid(labels: string): boolean {
        if (labels.length === 0) {
            return true;
        }
        return labels.split(',').every((label: string) => descRegex.test(label));
    }
}
