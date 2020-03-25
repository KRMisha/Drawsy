import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { snackBarDuration } from '@app/modals/constants/snack-bar-duration';
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
    constructor(
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService,
        private serverService: ServerService,
        private snackBar: MatSnackBar
    ) {}

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        this.drawingService.id === undefined ? this.createDrawing() : this.updateDrawing();
    }

    get title(): string {
        return this.drawingService.title;
    }
    set title(title: string) {
        this.drawingService.title = title;
    }

    get labels(): string[] {
        return this.drawingService.labels;
    }
    set labels(labels: string[]) {
        this.drawingService.labels = labels;
    }

    private createDrawing(): void {
        this.serverService
            .createDrawing(this.drawingPreviewService.drawingPreviewRoot.outerHTML)
            .pipe(catchError(this.alertCreateDrawingError()))
            .subscribe((newFileId: NewFileId): void => {
                this.drawingService.id = newFileId.id;
                this.snackBar.open('Dessin sauvegardé : ' + this.title, undefined, {
                    duration: snackBarDuration,
                });
            });
    }

    private updateDrawing(): void {
        this.serverService
            // ID will not be undefined if this method is called
            // tslint:disable-next-line: no-non-null-assertion
            .updateDrawing(this.drawingService.id!, this.drawingPreviewService.drawingPreviewRoot.outerHTML)
            .pipe(catchError(this.alertUpdateDrawingError()))
            .subscribe(
                (): void => {
                    this.snackBar.open('Dessin mis à jour : ' + this.title, undefined, {
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
