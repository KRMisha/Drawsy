// tslint:disable: no-string-literal

import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import { Subject } from 'rxjs';

describe('GalleryService', () => {
    let service: GalleryService;
    let serverServiceSpyObj: jasmine.SpyObj<ServerService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let drawingService: jasmine.SpyObj<DrawingService>;
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
        serverServiceSpyObj.deleteDrawing.and.returnValue(deleteDrawingSubject);
        getAllDrawingsSubject = new Subject<SavedFile[]>();
        serverServiceSpyObj.getAllDrawings.and.returnValue(getAllDrawingsSubject);

        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', [
            'loadDrawing',
            'makeSvgFileContainerFromSavedFile',
        ]);
        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        drawingService = jasmine.createSpyObj('DrawingService', [], { id: 12 });

        TestBed.configureTestingModule({
            providers: [
                { provide: ServerService, useValue: serverServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
                { provide: DrawingService, useValue: drawingService },
            ],
        });

        service = TestBed.inject(GalleryService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#loadDrawing should use the open method of snackBar to display a message if the drawingSerializer returns true', () => {
        drawingSerializerServiceSpyObj.loadDrawing.and.returnValue(true);
        service.loadDrawing(svgFileContainer);
        expect(drawingSerializerServiceSpyObj.loadDrawing).toHaveBeenCalledWith(svgFileContainer);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin chargé : ' + svgFileContainer.title, undefined, {
            duration: snackBarDuration,
        });
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    });

    it('#loadDrawing should not display a message if the drawingSerializer returns false', () => {
        drawingSerializerServiceSpyObj.loadDrawing.and.returnValue(false);
        service.loadDrawing(svgFileContainer);
        expect(drawingSerializerServiceSpyObj.loadDrawing).toHaveBeenCalledWith(svgFileContainer);
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it('#deleteDrawing should abort if the confirmation message is denied', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        service.deleteDrawing(svgFileContainer);
        expect(serverServiceSpyObj.deleteDrawing).not.toHaveBeenCalled();
    });

    it(
        '#deleteDrawing should use the open method of snackBar to display a message if the request was successfull' +
            'and delete the drawing from _drawings when there is more than one drawing',
        async(() => {
            spyOn(window, 'confirm').and.returnValue(true);
            service.deleteDrawing(svgFileContainer);
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);

            const svgFileContainerMock1: SvgFileContainer = { id: '1', labels: ['bonjour'], title: '1', drawingRoot: {} as SVGSVGElement };
            const drawings: SvgFileContainer[] = [svgFileContainerMock1, svgFileContainer];
            service['_drawings'] = drawings;
            deleteDrawingSubject.next();
            expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin supprimé : ' + svgFileContainer.title, undefined, {
                duration: snackBarDuration,
            });
            expect(service['_drawings']).toEqual([svgFileContainerMock1]);
        })
    );

    it(
        '#deleteDrawing should use the open method of snackBar to display a message if the request was successfull' +
            'and should not remove the drawing from _drawings if it is not there',
        async(() => {
            spyOn(window, 'confirm').and.returnValue(true);
            service.deleteDrawing(svgFileContainer);
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);

            const svgFileContainerMock1: SvgFileContainer = { id: '1', labels: ['bonjour'], title: '1', drawingRoot: {} as SVGSVGElement };
            const drawings: SvgFileContainer[] = [svgFileContainerMock1];
            service['_drawings'] = drawings;
            deleteDrawingSubject.next();
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
            expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);

            const error = { status: HttpStatusCode.NotFound } as HttpErrorResponse;
            deleteDrawingSubject.error(error);
            expect(service.getAllDrawings).toHaveBeenCalled();
            const errorMessage = "Erreur : le dessin à supprimer n'a pas pu être trouvé.";
            expect(snackBarSpyObj.open).toHaveBeenCalledWith(errorMessage, undefined, {
                duration: snackBarDuration,
            });
        }
    );

    it('#deleteDrawing should not call #getAllDrawings and not display a message if the error status is different of NotFound', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(service, 'getAllDrawings');

        service.deleteDrawing(svgFileContainer);
        expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);

        const error = { status: HttpStatusCode.BadRequest } as HttpErrorResponse;
        deleteDrawingSubject.error(error);
        expect(service.getAllDrawings).not.toHaveBeenCalled();
        expect(snackBarSpyObj.open).not.toHaveBeenCalled();
    });

    it(
        "#getAllDrawings should set _areDrawingsLoaded to false, call serverService's getAllDrawings," +
            'load drawings into _drawings and then set _areDrawingsLoaded to true',
        () => {
            service['_areDrawingsLoaded'] = true;
            service['_drawings'] = [] as SvgFileContainer[];
            service.getAllDrawings();
            expect(service['_areDrawingsLoaded']).toBeFalsy();
            expect(serverServiceSpyObj.getAllDrawings).toHaveBeenCalled();

            const svgFileContainerMock = {} as SvgFileContainer;
            drawingSerializerServiceSpyObj.makeSvgFileContainerFromSavedFile.and.returnValue(svgFileContainerMock);
            getAllDrawingsSubject.next(savedFiles);
            getAllDrawingsSubject.complete();
            expect(drawingSerializerServiceSpyObj.makeSvgFileContainerFromSavedFile).toHaveBeenCalledWith(savedFile1);
            expect(drawingSerializerServiceSpyObj.makeSvgFileContainerFromSavedFile).toHaveBeenCalledWith(savedFile2);
            expect(drawingSerializerServiceSpyObj.makeSvgFileContainerFromSavedFile).toHaveBeenCalledWith(savedFile3);
            expect(service['_drawings']).toEqual([svgFileContainerMock, svgFileContainerMock, svgFileContainerMock]);
            expect(service['_areDrawingsLoaded']).toBeTruthy();
        }
    );

    it('#getDrawingsWithLabels should return all drawings if there are no labels', () => {
        const svgFileContainerMock = {} as SvgFileContainer;
        const drawingsMock = [svgFileContainerMock, svgFileContainerMock, svgFileContainerMock, svgFileContainerMock];
        service['_drawings'] = drawingsMock;
        const returnValue = service.getDrawingsWithLabels([]);
        expect(returnValue).toEqual(drawingsMock);
    });

    it('#getDrawingsWithLabels should return appropriate drawings when given a label', () => {
        const svgFileContainerMock1: SvgFileContainer = { id: '1', labels: ['bonjour'], title: '1', drawingRoot: {} as SVGSVGElement };
        const svgFileContainerMock2: SvgFileContainer = { id: '2', labels: ['allo'], title: '2', drawingRoot: {} as SVGSVGElement };
        const svgFileContainerMock3: SvgFileContainer = { id: '3', labels: ['salut'], title: '3', drawingRoot: {} as SVGSVGElement };
        service['_drawings'] = [svgFileContainerMock1, svgFileContainerMock2, svgFileContainerMock3];
        const returnValue = service.getDrawingsWithLabels(['salut']);
        expect(returnValue).toEqual([svgFileContainerMock3]);
    });

    it('#hasDrawings should return false if there are no drawings', () => {
        service['_drawings'] = [];
        const returnValue = service.hasDrawings();
        expect(returnValue).toBeFalsy();
    });

    it('#hasDrawings should return true if there are drawings', () => {
        service['_drawings'] = [{} as SvgFileContainer];
        const returnValue = service.hasDrawings();
        expect(returnValue).toBeTruthy();
    });

    it('#get areDrawingsLoaded should return true if there are drawings loaded', () => {
        service['_areDrawingsLoaded'] = true;
        const returnValue = service['_areDrawingsLoaded'];
        expect(returnValue).toBeTruthy();
    });

    it('#get areDrawingsLoaded should return false if there are no drawings loaded', () => {
        service['_areDrawingsLoaded'] = false;
        const returnValue = service.areDrawingsLoaded;
        expect(returnValue).toBeFalsy();
    });
});
