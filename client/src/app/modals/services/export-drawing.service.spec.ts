import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { Subject } from 'rxjs';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let serverServiceSpyObj: jasmine.SpyObj<ServerService>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;

    let emailDrawingSubject: Subject<void>;
    const drawingTitle = 'DrawingTitle';
    beforeEach(() => {
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', ['downloadDrawing', 'exportAsBlob']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], { title: drawingTitle });

        serverServiceSpyObj = jasmine.createSpyObj('ServerService', ['emailDrawing']);
        emailDrawingSubject = new Subject<void>();
        serverServiceSpyObj.emailDrawing.and.returnValue(emailDrawingSubject);

        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ServerService, useValue: serverServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
            ],
        });
        service = TestBed.inject(ExportDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#downloadDrawing should forward the call to drawingSerializerService', () => {
        const drawingRootStub = {} as SVGSVGElement;
        const fileType = FileType.Jpeg;
        service.downloadDrawing(drawingRootStub, fileType);
        expect(drawingSerializerServiceSpyObj.downloadDrawing).toHaveBeenCalledWith(drawingRootStub, drawingServiceSpyObj.title, fileType);
    });

    it(
        '#emailDrawing should forward the call to convert the drawing to a blob using the serializer' +
            'and display a message using the snackBar to indicate that the file is being sent',
        fakeAsync(() => {
            const drawingRootStub = {} as SVGSVGElement;
            const fileType = FileType.Jpeg;
            const emailAddress = 'hein@hotmail.ca';
            service.emailDrawing(drawingRootStub, emailAddress, fileType);
            expect(snackBarSpyObj.open).toHaveBeenCalledWith("Votre courriel est en cours d'envoi à " + emailAddress, 'Cacher');
            tick();
            expect(drawingSerializerServiceSpyObj.exportAsBlob).toHaveBeenCalled();
        })
    );

    it('#emailDrawing should forward the call to the serverService and display a message on success', fakeAsync(() => {
        const fileType = FileType.Jpeg;
        const emailAddress = 'hein@hotmail.ca';
        const blobStub = {} as Blob;
        drawingSerializerServiceSpyObj.exportAsBlob.and.returnValue(Promise.resolve(blobStub));
        service.emailDrawing({} as SVGSVGElement, emailAddress, fileType);
        tick();
        emailDrawingSubject.next();
        const expectedTitle = drawingTitle + '.' + fileType;
        expect(serverServiceSpyObj.emailDrawing).toHaveBeenCalledWith(emailAddress, blobStub, expectedTitle);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Votre dessin a été envoyé par courriel à ' + emailAddress, undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#emailDrawing display an error message on BadRequest', fakeAsync(() => {
        const fileType = FileType.Jpeg;
        const emailAddress = 'hein@hotmail.ca';
        const blobStub = {} as Blob;
        drawingSerializerServiceSpyObj.exportAsBlob.and.returnValue(Promise.resolve(blobStub));
        service.emailDrawing({} as SVGSVGElement, emailAddress, fileType);
        tick();

        const error = { status: HttpStatusCode.BadRequest } as HttpErrorResponse;
        const errorMessage = "Erreur : l'adresse courriel que vous avez entrée n'existe pas.";

        emailDrawingSubject.error(error);
        const expectedTitle = drawingTitle + '.' + fileType;
        expect(serverServiceSpyObj.emailDrawing).toHaveBeenCalledWith(emailAddress, blobStub, expectedTitle);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith(errorMessage, undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#emailDrawing should display an error message on TooManyRequest', fakeAsync(() => {
        const fileType = FileType.Jpeg;
        const emailAddress = 'hein@hotmail.ca';
        const blobStub = {} as Blob;
        drawingSerializerServiceSpyObj.exportAsBlob.and.returnValue(Promise.resolve(blobStub));
        service.emailDrawing({} as SVGSVGElement, emailAddress, fileType);
        tick();

        const error = { status: HttpStatusCode.TooManyRequests } as HttpErrorResponse;
        const errorMessage = "Erreur : vous avez dépassé votre limite horaire d'envois de courriels.";

        emailDrawingSubject.error(error);
        const expectedTitle = drawingTitle + '.' + fileType;
        expect(serverServiceSpyObj.emailDrawing).toHaveBeenCalledWith(emailAddress, blobStub, expectedTitle);
        expect(snackBarSpyObj.open).toHaveBeenCalledWith(errorMessage, undefined, {
            duration: snackBarDuration,
        });
    }));

    it('#emailDrawing should not display an error message if the statusCode is different from TooManyRequest or BadRequest',
        fakeAsync(() => {
            const fileType = FileType.Jpeg;
            const emailAddress = 'hein@hotmail.ca';
            const blobStub = {} as Blob;
            drawingSerializerServiceSpyObj.exportAsBlob.and.returnValue(Promise.resolve(blobStub));
            service.emailDrawing({} as SVGSVGElement, emailAddress, fileType);
            tick();

            const error = { status: HttpStatusCode.ImATeapot } as HttpErrorResponse;

            emailDrawingSubject.error(error);
            const expectedTitle = drawingTitle + '.' + fileType;
            expect(serverServiceSpyObj.emailDrawing).toHaveBeenCalledWith(emailAddress, blobStub, expectedTitle);
            expect(snackBarSpyObj.open).toHaveBeenCalledTimes(1);
    }));
});
