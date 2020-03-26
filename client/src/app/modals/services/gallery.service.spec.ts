import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { SavedFile } from '@common/communication/saved-file';
import { Subject } from 'rxjs';

fdescribe('GalleryService', () => {
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
        drawingService = jasmine.createSpyObj('DrawingService', [], {id: 12});

        TestBed.configureTestingModule({
            providers: [
                {provide: ServerService, useValue: serverServiceSpyObj},
                {provide: Router, useValue: routerSpyObj},
                {provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj},
                {provide: MatSnackBar, useValue: snackBarSpyObj},
                {provide: DrawingService, useValue: drawingService},
            ],
        });
    }));

    it('should be created', () => {
        service = TestBed.inject(GalleryService);
        expect(service).toBeTruthy();
    });

    // it('#loadDrawing should use the open method of snackBar to display a message if the drawingSerializer returns true', () => {
    //     drawingSerializerServiceSpyObj.loadDrawing.and.returnValue(true);
    //     service.loadDrawing(svgFileContainer);
    //     expect(drawingSerializerServiceSpyObj.loadDrawing).toHaveBeenCalledWith(svgFileContainer);
    //     expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin chargé : ' + svgFileContainer.title, undefined, {
    //         duration: snackBarDuration,
    //     });
    //     expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    // });

    it('#deleteDrawing should use the open method of snackBar to display a message if the request was successfull', async(() => {
        service.deleteDrawing(svgFileContainer);
        deleteDrawingSubject.next();
        expect(serverServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(svgFileContainer.id);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Dessin supprimé : ' + svgFileContainer.title, undefined, {
            duration: snackBarDuration,
        });
    }));
});
