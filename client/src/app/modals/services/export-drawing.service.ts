import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ServerService } from '@app/shared/services/server.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    constructor(
        private drawingSerializerService: DrawingSerializerService,
        private drawingService: DrawingService,
        private serverService: ServerService,
        private snackbarService: SnackbarService
    ) {}

    downloadDrawing(drawingRoot: SVGSVGElement, fileType: FileType): void {
        this.drawingSerializerService.downloadDrawing(drawingRoot, this.drawingService.title, fileType);
    }

    async emailDrawing(drawingRoot: SVGSVGElement, emailAddress: string, fileType: FileType): Promise<void> {
        this.snackbarService.displayDismissableMessage("Votre courriel est en cours d'envoi à " + emailAddress, 'Cacher');
        const drawingBlob = await this.drawingSerializerService.exportAsBlob(drawingRoot, fileType);
        this.serverService
            .emailDrawing(emailAddress, drawingBlob, this.drawingService.title + '.' + fileType)
            .pipe(catchError(this.alertEmailDrawingError()))
            .subscribe(
                () => {
                    this.snackbarService.displayMessage('Votre dessin a été envoyé par courriel à ' + emailAddress);
                },
                // No error handling needs to be done but the error must be caught
                (error: HttpErrorResponse) => {} // tslint:disable-line: no-empty
            );
    }

    private alertEmailDrawingError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.BadRequest:
                    errorMessage = "Erreur : l'adresse courriel que vous avez entrée n'existe pas";
                    break;
                case HttpStatusCode.TooManyRequests:
                    errorMessage = "Erreur : vous avez dépassé votre limite horaire d'envois de courriels";
                    break;
            }

            if (errorMessage !== '') {
                this.snackbarService.displayMessage(errorMessage);
            }

            return throwError(error);
        };
    }
}
