import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DrawingLoadOptions } from '@app/drawing/classes/drawing-load-options';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal

describe('GalleryService', () => {
    let service: GalleryService;
    let serverServiceSpyObj: jasmine.SpyObj<ServerService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let deleteDrawingSubject: Subject<void>;
    let getAllDrawingsSubject: Subject<SavedFile[]>;

    const svgFileContainer: SvgFileContainer = {
        id: '123',
        title: 'Test Title',
        labels: ['Test1', 'Test2', 'Test3'],
        drawingRoot: {} as SVGSVGElement,
    };
    const savedFile1: SavedFile = { id: '123', content: 'abcde' };
    const savedFile2: SavedFile = { id: '456', content: 'fghij' };
    const savedFile3: SavedFile = { id: '789', content: 'klmno' };
    const savedFiles: SavedFile[] = [savedFile1, savedFile2, savedFile3];

    beforeEach(async(() => {
        serverServiceSpyObj = jasmine.createSpyObj('ServerService', ['deleteDrawing', 'getAllDrawings']);
        deleteDrawingSubject = new Subject<void>();
        getAllDrawingsSubject = new Subject<SavedFile[]>();
        serverServiceSpyObj.deleteDrawing.and.returnValue(deleteDrawingSubject);
        serverServiceSpyObj.getAllDrawings.and.returnValue(getAllDrawingsSubject);

        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', ['getDrawingLoadOptions', 'deserializeDrawing']);
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['loadDrawingWithConfirmation'], { id: 12 });

        TestBed.configureTestingModule({
            providers: [
                { provide: ServerService, useValue: serverServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });

        service = TestBed.inject(GalleryService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#loadDrawing should use the open method of snackBar to display a message if the drawingService returns true', () => {
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        drawingSerializerServiceSpyObj.getDrawingLoadOptions.and.returnValue(drawingLoadOptionsMock);
        drawingServiceSpyObj.loadDrawingWithConfirmation.and.returnValue(true);
        service.loadDrawing(svgFileContainer);
        expect(drawingSerializerServiceSpyObj.getDrawingLoadOptions).toHaveBeenCalledWith(svgFileContainer);
        expect(drawingServiceSpyObj.loadDrawingWithConfirmation).toHaveBeenCalledWith(drawingLoadOptionsMock);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin chargé : ' + svgFileContainer.title, undefined, {
            duration: snackBarDuration,
        });
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    });

    it('#loadDrawing should not display a message if the drawingSerializer returns false', () => {
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        drawingSerializerServiceSpyObj.getDrawingLoadOptions.and.returnValue(drawingLoadOptionsMock);
        drawingServiceSpyObj.loadDrawingWithConfirmation.and.returnValue(false);
        service.loadDrawing(svgFileContainer);
        expect(drawingSerializerServiceSpyObj.getDrawingLoadOptions).toHaveBeenCalledWith(svgFileContainer);
        expect(drawingServiceSpyObj.loadDrawingWithConfirmation).toHaveBeenCalledWith(drawingLoadOptionsMock);
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it('#deleteDrawing should abort if the confirmation message is denied', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        service.deleteDrawing(svgFileContainer);
        expect(serverServiceSpyObj.deleteDrawing).not.toHaveBeenCalled();
    });

    it(
        '#deleteDrawing should use the open method of snackBar to display a message if the request was successful' +
            'and delete the drawing from _drawings',
        async(() => {
            spyOn(window, 'confirm').and.returnValue(true);
            service.deleteDrawing(svgFileContainer);

            const svgFileContainerMock1: SvgFileContainer = { id: '1', labels: ['bonjour'], title: '1', drawingRoot: {} as SVGSVGElement };
            const drawings: SvgFileContainer[] = [svgFileContainerMock1, svgFileContainer];
            service['_drawings'] = drawings;

            deleteDrawingSubject.next();
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);
            expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin supprimé : ' + svgFileContainer.title, undefined, {
                duration: snackBarDuration,
            });
            expect(service['_drawings']).toEqual([svgFileContainerMock1]);
        })
    );

    it(
        '#deleteDrawing should use the open method of snackBar to display a message if the request was successful' +
            'and should not remove the drawing from _drawings if it is not there',
        async(() => {
            spyOn(window, 'confirm').and.returnValue(true);
            service.deleteDrawing(svgFileContainer);

            const svgFileContainerMock1: SvgFileContainer = { id: '1', labels: ['bonjour'], title: '1', drawingRoot: {} as SVGSVGElement };
            const drawings: SvgFileContainer[] = [svgFileContainerMock1];
            service['_drawings'] = drawings;

            deleteDrawingSubject.next();
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);
            expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin supprimé : ' + svgFileContainer.title, undefined, {
                duration: snackBarDuration,
            });
            expect(service['_drawings']).toEqual([svgFileContainerMock1]);
        })
    );

    it(
        '#deleteDrawing should call #getAllDrawings and use the open method of snackbar to display a message' +
            'if the error status is NotFound',
        () => {
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(service, 'getAllDrawings');
            service.deleteDrawing(svgFileContainer);

            const error = { status: HttpStatusCode.NotFound } as HttpErrorResponse;
            const errorMessage = "Erreur : le dessin à supprimer n'a pas pu être trouvé.";

            deleteDrawingSubject.error(error);
            expect(service.getAllDrawings).toHaveBeenCalled();
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);
            expect(snackBarSpyObj.open).toHaveBeenCalledWith(errorMessage, undefined, {
                duration: snackBarDuration,
            });
        }
    );

    it('#deleteDrawing should not call #getAllDrawings and not display a message if the error status is different of NotFound', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(service, 'getAllDrawings');
        service.deleteDrawing(svgFileContainer);

        const error = { status: HttpStatusCode.BadRequest } as HttpErrorResponse;

        deleteDrawingSubject.error(error);
        expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);
        expect(service.getAllDrawings).not.toHaveBeenCalled();
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
    });

    it(
        "#getAllDrawings should set _isLoadingComplete to false, call serverService's getAllDrawings," +
            'load drawings into _drawings and then set _isLoadingComplete to true',
        () => {
            service['_isLoadingComplete'] = true;
            service['_drawings'] = [] as SvgFileContainer[];
            service.getAllDrawings();

            const svgFileContainerMock = {} as SvgFileContainer;
            drawingSerializerServiceSpyObj.deserializeDrawing.and.returnValue(svgFileContainerMock);

            getAllDrawingsSubject.next(savedFiles);
            expect(service['_isLoadingComplete']).toEqual(false);
            expect(serverServiceSpyObj.getAllDrawings).toHaveBeenCalled();

            getAllDrawingsSubject.complete();
            expect(drawingSerializerServiceSpyObj.deserializeDrawing).toHaveBeenCalledWith(savedFile1.content, savedFile1.id);
            expect(drawingSerializerServiceSpyObj.deserializeDrawing).toHaveBeenCalledWith(savedFile2.content, savedFile2.id);
            expect(drawingSerializerServiceSpyObj.deserializeDrawing).toHaveBeenCalledWith(savedFile3.content, savedFile3.id);
            expect(service['_drawings']).toEqual([svgFileContainerMock, svgFileContainerMock, svgFileContainerMock]);
            expect(service['_isLoadingComplete']).toEqual(true);
        }
    );

    it('#getAllDrawings should set its array of drawings to empty when the request returns an error', async(() => {
        service.getAllDrawings();
        const error = { status: HttpStatusCode.BadRequest } as HttpErrorResponse;
        getAllDrawingsSubject.error(error);
        expect(service['_drawings']).toEqual([]);
    }));

    it('#get drawings should return drawings', () => {
        const drawingStub = {} as SvgFileContainer;
        const drawingsStub = [drawingStub, drawingStub];
        service['_drawings'] = drawingsStub;
        const returnValue = service.drawings;
        expect(returnValue).toEqual(drawingsStub);
    });

    it('#get isLoadingComplete should return true if there are drawings loaded', () => {
        service['_isLoadingComplete'] = true;
        const returnValue = service['_isLoadingComplete'];
        expect(returnValue).toEqual(true);
    });

    it('#get isLoadingComplete should return false if there are no drawings loaded', () => {
        service['_isLoadingComplete'] = false;
        const returnValue = service.isLoadingComplete;
        expect(returnValue).toEqual(false);
    });
});
