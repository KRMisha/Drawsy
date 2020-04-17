import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileId } from '@common/communication/new-file-id';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('SaveDrawingService', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
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
        serverServiceSpyObj = jasmine.createSpyObj('ServerService', ['createDrawing', 'updateDrawing']);
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        createDrawingSubject = new Subject<NewFileId>();
        serverServiceSpyObj.createDrawing.and.returnValue(createDrawingSubject);
        updateDrawingSubject = new Subject<void>();
        serverServiceSpyObj.updateDrawing.and.returnValue(updateDrawingSubject);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ServerService, useValue: serverServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
            ],
        });
        saveDrawingService = TestBed.inject(SaveDrawingService);
    }));

    it('should be created', () => {
        expect(saveDrawingService).toBeTruthy();
    });

    it('#saveDrawing should call #createDrawing when drawingService id is undefined', () => {
        const createDrawingSpy = spyOn<any>(saveDrawingService, 'createDrawing');
        const updateDrawingSpy = spyOn<any>(saveDrawingService, 'updateDrawing');

        saveDrawingService['drawingService'] = jasmine.createSpyObj('DrawingService', [], {
            id: undefined,
            title: 'initialTitle',
            labels: '',
        });
        const drawingRootStub = {} as SVGSVGElement;
        saveDrawingService.saveDrawing(drawingRootStub);
        expect(updateDrawingSpy).not.toHaveBeenCalled();
        expect(createDrawingSpy).toHaveBeenCalledWith(drawingRootStub);
    });

    it('#saveDrawing should call #updateDrawing when drawingService id is not undefined', () => {
        const createDrawingSpy = spyOn<any>(saveDrawingService, 'createDrawing');
        const updateDrawingSpy = spyOn<any>(saveDrawingService, 'updateDrawing');

        const drawingRootStub = {} as SVGSVGElement;
        saveDrawingService.saveDrawing(drawingRootStub);
        expect(updateDrawingSpy).toHaveBeenCalledWith(drawingRootStub);
        expect(createDrawingSpy).not.toHaveBeenCalled();
    });

    it("#createDrawing should update drawingService's id and display success message when the request is successful", async(() => {
        const drawingServiceMock = { id: initialId, title: initialTitle } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;

        saveDrawingService['createDrawing'](drawingRootMock);
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith(drawingRootMock.outerHTML);
        createDrawingSubject.next(newFileId);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin sauvegardé : ' + drawingServiceMock.title, undefined, {
            duration: snackBarDuration,
        });
        expect(drawingServiceMock.id).toEqual(newFileId.id);
    }));

    it('#createDrawing should display error message when the request is status BadRequest', async(() => {
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
        saveDrawingService['createDrawing'](drawingRootMock);
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith(drawingRootMock.outerHTML);
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
        createDrawingSubject.error(error);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : titre ou étiquettes invalides', undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#createDrawing should not display error message when the request error status is different from BadRequest', async(() => {
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
        saveDrawingService['createDrawing'](drawingRootMock);
        expect(serverServiceSpyObj.createDrawing).toHaveBeenCalledWith(drawingRootMock.outerHTML);
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadGateway });
        createDrawingSubject.error(error);
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
    }));

    it('#updateDrawing should display success message when the request is successful', async(() => {
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
        saveDrawingService['updateDrawing'](drawingRootMock);
        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, drawingRootMock.outerHTML);
        updateDrawingSubject.next();
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin mis à jour : ' + drawingServiceSpyObj.title, undefined, {
            duration: snackBarDuration,
        });
    }));

    it(
        "#updateDrawing should display appropriate error message and set drawingService's id to " +
            'undefined when the request error is NotFound',
        async(() => {
            const drawingServiceMock = { id: initialId } as DrawingService;
            saveDrawingService['drawingService'] = drawingServiceMock;
            const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
            saveDrawingService['updateDrawing'](drawingRootMock);

            expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, drawingRootMock.outerHTML);
            const error = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
            updateDrawingSubject.error(error);
            const notFoundErrorMessage =
                "Erreur : le dessin à mettre à jour n'a pas pu être trouvé.\n" +
                'Réessayez pour le sauvegarder en tant que nouveau dessin.';
            expect(snackBarSpyObj.open).toHaveBeenCalledWith(notFoundErrorMessage, undefined, {
                duration: snackBarDuration,
            });
            expect(drawingServiceMock.id).toBeUndefined();
        })
    );

    it('#updateDrawing should display appropriate error message when the request error is BadRequest', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
        saveDrawingService['updateDrawing'](drawingRootMock);

        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, drawingRootMock.outerHTML);
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
        updateDrawingSubject.error(error);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Erreur : titre ou étiquettes invalides', undefined, {
            duration: snackBarDuration,
        });
        expect(drawingServiceMock.id).toEqual(initialId);
    }));

    it('#updateDrawing should only display an error message when the error status is different from BadRequest or Notfound', async(() => {
        const drawingServiceMock = { id: initialId } as DrawingService;
        saveDrawingService['drawingService'] = drawingServiceMock;
        const drawingRootMock = { outerHTML: 'MockOuterHtml' } as SVGSVGElement;
        saveDrawingService['updateDrawing'](drawingRootMock);

        expect(serverServiceSpyObj.updateDrawing).toHaveBeenCalledWith(initialId, drawingRootMock.outerHTML);
        const error = new HttpErrorResponse({ status: HttpStatusCode.BadGateway });
        updateDrawingSubject.error(error);
        expect(drawingServiceMock.id).toEqual(initialId);
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
    }));
});
