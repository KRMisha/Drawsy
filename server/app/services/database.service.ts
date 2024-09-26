import { FileSchema } from '@app/classes/file-schema';
import { HttpException } from '@app/classes/http-exception';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import MetadataValidation from '@common/validation/metadata-validation';
import { inject, injectable } from 'inversify';
import { JSDOM } from 'jsdom';
import { Collection, MongoClient, ObjectId } from 'mongodb';

// Disable require import lint errors because DOMPurify does not work without it
const createDomPurify = require('dompurify'); // tslint:disable-line: no-require-imports no-var-requires

const databaseName = 'database';
const collectionName = 'drawings';

export const databaseUri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST;

@injectable()
export class DatabaseService {
    private client: MongoClient;
    private collection: Collection<FileSchema>;

    constructor(@inject(Types.DatabaseUri) uri: string) {
        this.client = new MongoClient(uri);
        this.collection = this.client.db(databaseName).collection(collectionName);

        // Force the server to crash on startup if it cannot connect to the database
        this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }

    async createFile(fileContent: string): Promise<string> {
        const sanitizedFileContent = this.sanitizeFileContent(fileContent);
        if (this.isFileValid(sanitizedFileContent)) {
            const result = await this.collection.insertOne({ content: sanitizedFileContent } as FileSchema);
            return result.insertedId.toHexString();
        }
        throw new HttpException(HttpStatusCode.BadRequest, 'Invalid file');
    }

    async updateFile(fileId: string, fileContent: string): Promise<void> {
        const sanitizedFileContent = this.sanitizeFileContent(fileContent);
        if (this.isFileValid(sanitizedFileContent)) {
            const result = await this.collection.replaceOne({ _id: new ObjectId(fileId) }, { content: sanitizedFileContent } as FileSchema);
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
            ({ id: element._id.toString(), content: element.content }) as SavedFile;
        return collection.map(convertSchemaToSavedFile);
    }

    private sanitizeFileContent(fileContent: string): string {
        const window = new JSDOM('').window;
        const domPurify = createDomPurify(window);
        return domPurify.sanitize(fileContent);
    }

    private isFileValid(fileContent: string): boolean {
        const dom = new JSDOM(fileContent);
        const drawingRoot = dom.window.document.getElementsByTagName('svg')[0];

        const title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
        const labelsString = drawingRoot.getElementsByTagName('desc')[0].innerHTML;

        return this.isTitleValid(title) && this.areLabelsValid(labelsString);
    }

    private isTitleValid(title: string): boolean {
        return MetadataValidation.contentRegex.test(title) && title.length <= MetadataValidation.maxTitleLength;
    }

    private areLabelsValid(labelsString: string): boolean {
        if (labelsString.length === 0) {
            return true;
        }
        return labelsString
            .split(',')
            .every((label: string) => MetadataValidation.contentRegex.test(label) && label.length <= MetadataValidation.maxLabelLength);
    }
}
