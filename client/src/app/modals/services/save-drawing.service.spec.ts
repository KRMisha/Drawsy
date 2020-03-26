import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileId } from '@common/communication/new-file-id';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

fdescribe('SaveDrawingService', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let drawingPreviewServiceSpyObj: jasmine.SpyObj<DrawingPreviewService>;
    let drawingPreviewRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let serverServiceSpyObj: jasmine.SpyObj<ServerService>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let createDrawingSubject: Subject<NewFileId>;
    let updateDrawingSubject: Subject<void>;
    let saveDrawingService: SaveDrawingService;

    const newFileId: NewFileId = { id: '123' };
    const initialLabels: string[] = ['test'];
    const initialTitle = 'initialTitle';
    const initialId = 'initialId';
    beforeEach(async(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            id: initialId,
            title: initialTitle,
            labels: initialLabels,
        });
        drawingPreviewRootSpyObj = jasmine.createSpyObj('SVGSVGElement', [], {
            outerHTML: 'outerHTML',
        });
        drawingPreviewServiceSpyObj = jasmine.createSpyObj('DrawingPreviewService', [
            'finalizePreview',
        ], {
            drawingPreviewRoot: drawingPreviewRootSpyObj,
        });
        serverServiceSpyObj = jasmine.createSpyObj('ServerService', [
            'createDrawing',
            'updateDrawing',
        ]);
        createDrawingSubject = new Subject<NewFileId>();
        serverServiceSpyObj.createDrawing.and.returnValue(createDrawingSubject);
        updateDrawingSubject = new Subject<void>();
        serverServiceSpyObj.updateDrawing.and.returnValue(updateDrawingSubject);
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', [
            'open',
        ]);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: DrawingPreviewService, useValue: drawingPreviewServiceSpyObj },
                { provide: ServerService, useValue: serverServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
            ],
        });
        saveDrawingService = TestBed.inject(SaveDrawingService);
    }));

    it('should be created', () => {
        expect(saveDrawingService).toBeTruthy();
    });

    it('#getTitle should return appropriate title', () => {
        const title = saveDrawingService.title;
        expect(title).toEqual('initialTitle');
    });

    it('#setTitle should set the title accordingly', () => {
        const newTitle = 'testTitle';
        const drawingServiceMock = { title: initialTitle } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        saveDrawingService.title = newTitle;
        expect(drawingServiceMock.title).toEqual(newTitle);
    });

    it('#getLabels should return appropriate labels', () => {
        const labels = saveDrawingService.labels;
        expect(labels).toEqual(['test']);
    });

    it('#setLabels should set the labels accordingly', () => {
        const drawingServiceMock = {labels: initialLabels} as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        const newLabels = ['123'];
        saveDrawingService.labels = newLabels;
        expect(drawingServiceMock.labels).toEqual(newLabels);
    });

    it('#saveDrawing should call #createDrawing when drawingService id is undefined', () => {
        const createDrawingSpy = spyOn<any>(saveDrawingService, 'createDrawing');
        const updateDrawingSpy = spyOn<any>(saveDrawingService, 'updateDrawing');

        const tmpDrawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            id: undefined,
            title: 'initialTitle',
            labels: '',
        });
        saveDrawingService['drawingService'] = tmpDrawingServiceSpyObj;
        saveDrawingService.saveDrawing();
        expect(drawingPreviewServiceSpyObj.finalizePreview).toHaveBeenCalled();
        expect(updateDrawingSpy).not.toHaveBeenCalled();
        expect(createDrawingSpy).toHaveBeenCalled();
    });

    it('#saveDrawing should call #updateDrawing when drawingService id is not undefined', () => {
        const createDrawingSpy = spyOn<any>(saveDrawingService, 'createDrawing');
        const updateDrawingSpy = spyOn<any>(saveDrawingService, 'updateDrawing');

        saveDrawingService.saveDrawing();
        expect(drawingPreviewServiceSpyObj.finalizePreview).toHaveBeenCalled();
        expect(updateDrawingSpy).toHaveBeenCalled();
        expect(createDrawingSpy).not.toHaveBeenCalled();
    });

    it('#createDrawing should subscribe to the serverService\'s createDrawing with success', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        saveDrawingService['createDrawing']();
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith('outerHTML');
        createDrawingSubject.next(newFileId);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin sauvegardé : ' + saveDrawingService.title, undefined, {
            duration: snackBarDuration,
        });
        expect(drawingServiceMock.id).toEqual(newFileId.id);
    }));

    it('#createDrawing should subscribe to the serverService\'s createDrawing with failure when failure is BadRequest', async(() => {
        saveDrawingService['createDrawing']();
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith('outerHTML');
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
        createDrawingSubject.error(error);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : titre ou étiquettes invalides.', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#createDrawing should subscribe to the serverService\'s createDrawing with failure when failure is not BadRequest', async(() => {
        saveDrawingService['createDrawing']();
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith('outerHTML');
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadGateway });
        createDrawingSubject.error(error);
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
    }));

    it('#updateDrawing should subscribe to the serverService\'s updateDrawing with success', async(() => {
        saveDrawingService['updateDrawing']();
        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, 'outerHTML');
        updateDrawingSubject.next();
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin mis à jour : ' + saveDrawingService.title, undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#updateDrawing should subscribe to the serverService\'s updateDrawing with failure when failure is NotFound', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        saveDrawingService['updateDrawing']();
        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, 'outerHTML');
        const error = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        updateDrawingSubject.error(error);
        const notFoundErrorMessage =
                    "Erreur : le dessin à mettre à jour n'a pas pu être trouvé.\n" +
                    'Réessayez pour le sauvegarder en tant que nouveau dessin.';
        expect(snackBarSpyObj.open).toHaveBeenCalledWith(notFoundErrorMessage, undefined, {
            duration: snackBarDuration,
        });
        expect(drawingServiceMock.id).toEqual(undefined);
    }));

    it('#updateDrawing should subscribe to the serverService\'s updateDrawing with failure when failure is BadRequest', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        saveDrawingService['updateDrawing']();
        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, 'outerHTML');
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
        updateDrawingSubject.error(error);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : titre ou étiquettes invalides.', undefined, {
            duration: snackBarDuration,
        });
        expect(drawingServiceMock.id).toEqual(initialId);
    }));

    it('#updateDrawing should subscribe to the serverService\'s updateDrawing with failure when failure is not handled', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        saveDrawingService['updateDrawing']();
        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, 'outerHTML');
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadGateway });
        updateDrawingSubject.error(error);
        expect(drawingServiceMock.id).toEqual(initialId);
    }));
});
