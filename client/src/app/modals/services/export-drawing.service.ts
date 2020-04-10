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

    async sendEmail(drawingRoot: SVGSVGElement, emailAddress: string, fileType: FileType): Promise<void> {
        const formData = new FormData();
        formData.append('to', emailAddress);
        const blob = await this.drawingSerializerService.exportAsBlob(drawingRoot, fileType);
        formData.append('payload', blob, this.drawingService.title + '.' + fileType);

        this.serverService
            .sendEmail(formData)
            .pipe(catchError(this.alertSendEmailError()))
            .subscribe(
                () => {
                    this.snackBar.open('Votre courriel a été envoyé à ' + emailAddress, undefined, {
                        duration: snackBarDuration,
                    });
                },
                (error: HttpErrorResponse) => {} // tslint:disable-line: no-empty
            );
    }

    private alertSendEmailError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.TooManyRequests:
                    errorMessage = "Erreur : Vous avez dépasser votre limite de d'envois de couriels.";
                    break;
                case HttpStatusCode.BadRequest:
                    errorMessage = "Erreur : Le courriel que vous avez entré n'existe pas";
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
