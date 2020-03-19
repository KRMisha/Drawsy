import { DatabaseService } from '@app/services/database.service';
import Types from '@app/types';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileId } from '@common/communication/new-file-id';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DatabaseController {
    router = Router();

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post(
            '/create',
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    const insertedId = await this.databaseService.createFile(req.body.content);
                    res.status(HttpStatusCode.Created).send({ id: insertedId } as NewFileId);
                } catch (error) {
                    return next(error);
                }
            }
        );

        this.router.put(
            '/update/:id',
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    await this.databaseService.updateFile(req.params.id, req.body.content);
                    res.status(HttpStatusCode.Ok).end();
                } catch (error) {
                    return next(error);
                }
            }
        );

        this.router.delete(
            '/delete/:id',
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    await this.databaseService.deleteFile(req.params.id);
                    res.status(HttpStatusCode.NoContent).end();
                } catch (error) {
                    return next(error);
                }
            }
        );

        this.router.get(
            '/get-all',
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    const files = await this.databaseService.getFiles();
                    res.send(files);
                } catch (error) {
                    return next(error);
                }
            }
        );
    }
}
