import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
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
        private snackBar: MatSnackBar
    ) {}

    downloadDrawing(drawingRoot: SVGSVGElement, fileType: FileType): void {
        this.drawingSerializerService.downloadDrawing(drawingRoot, this.drawingService.title, fileType);
    }

    async emailDrawing(drawingRoot: SVGSVGElement, emailAddress: string, fileType: FileType): Promise<void> {
        const formData = new FormData();
        formData.append('to', emailAddress);
        const blob = await this.drawingSerializerService.exportAsBlob(drawingRoot, fileType);
        formData.append('payload', blob, this.drawingService.title + '.' + fileType);

        this.serverService
            .emailDrawing(formData)
            .pipe(catchError(this.alertEmailDrawingError()))
            .subscribe(
                () => {
                    this.snackBar.open('Votre dessin a été envoyé par courriel à ' + emailAddress, undefined, {
                        duration: snackBarDuration,
                    });
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
                    errorMessage = "Erreur : l'adresse courriel que vous avez entrée n'existe pas.";
                    break;
                case HttpStatusCode.TooManyRequests:
                    errorMessage = "Erreur : vous avez dépassé votre limite horaire d'envois de courriels.";
                    break;
            }

            if (errorMessage !== '') {
                this.snackBar.open(errorMessage, undefined, {
                    duration: snackBarDuration,
                });
            }

            return throwError(error);
        };
    }
}
