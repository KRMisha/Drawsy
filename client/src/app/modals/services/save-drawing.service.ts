import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { NewFileId } from '@common/communication/new-file-id';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const badRequestErrorMessage = 'Erreur : titre ou étiquettes invalides.';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    constructor(private drawingService: DrawingService, private serverService: ServerService, private snackBar: MatSnackBar) {}

    saveDrawing(drawingRoot: SVGSVGElement): void {
        this.drawingService.id === undefined ? this.createDrawing(drawingRoot) : this.updateDrawing(drawingRoot);
    }

    private createDrawing(drawingRoot: SVGSVGElement): void {
        this.serverService
            .createDrawing(drawingRoot.outerHTML)
            .pipe(catchError(this.alertCreateDrawingError()))
            .subscribe(
                (newFileId: NewFileId): void => {
                    this.drawingService.id = newFileId.id;
                    this.snackBar.open('Dessin sauvegardé : ' + this.drawingService.title, undefined, {
                        duration: snackBarDuration,
                    });
                },
                // No error handling needs to be done but the error must be caught
                (error: HttpErrorResponse): void => {} // tslint:disable-line: no-empty
            );
    }

    private updateDrawing(drawingRoot: SVGSVGElement): void {
        this.serverService
            // ID will not be undefined if this method is called
            // tslint:disable-next-line: no-non-null-assertion
            .updateDrawing(this.drawingService.id!, drawingRoot.outerHTML)
            .pipe(catchError(this.alertUpdateDrawingError()))
            .subscribe(
                (): void => {
                    this.snackBar.open('Dessin mis à jour : ' + this.drawingService.title, undefined, {
                        duration: snackBarDuration,
                    });
                },
                (error: HttpErrorResponse): void => {
                    if (error.status === HttpStatusCode.NotFound) {
                        this.drawingService.id = undefined;
                    }
                }
            );
    }

    private alertCreateDrawingError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            if (error.status === HttpStatusCode.BadRequest) {
                this.snackBar.open(badRequestErrorMessage, undefined, {
                    duration: snackBarDuration,
                });
            }

            return throwError(error);
        };
    }

    private alertUpdateDrawingError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            if (error.status === HttpStatusCode.NotFound || error.status === HttpStatusCode.BadRequest) {
                const notFoundErrorMessage =
                    "Erreur : le dessin à mettre à jour n'a pas pu être trouvé.\n" +
                    'Réessayez pour le sauvegarder en tant que nouveau dessin.';
                const errorMessage = error.status === HttpStatusCode.NotFound ? notFoundErrorMessage : badRequestErrorMessage;

                this.snackBar.open(errorMessage, undefined, {
                    duration: snackBarDuration,
                });
            }

            return throwError(error);
        };
    }
}
