import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { ServerService } from '@app/server/services/server.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../common/communication/http-status-code.enum';
import { NewFileId } from '../../../../../common/communication/new-file-id';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    get title(): string {
        return this.drawingPreviewService.title;
    }
    set title(title: string) {
        this.drawingPreviewService.title = title;
    }

    get labels(): string[] {
        return this.drawingPreviewService.labels;
    }
    set labels(labels: string[]) {
        this.drawingPreviewService.labels = labels;
    }

    get previewFilter(): PreviewFilter {
        return this.drawingPreviewService.previewFilter;
    }
    set previewFilter(previewFilter: PreviewFilter) {
        this.drawingPreviewService.previewFilter = previewFilter;
    }

    constructor(
        private drawingPreviewService: DrawingPreviewService,
        private serverService: ServerService,
        private snackBar: MatSnackBar
    ) {}

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        this.drawingPreviewService.id === undefined ? this.createDrawing() : this.updateDrawing();
    }

    private createDrawing(): void {
        this.serverService
            .createDrawing(this.drawingPreviewService.drawingPreviewRoot.outerHTML)
            .pipe(catchError(this.createDrawingErrorAlert()))
            .subscribe(
                (newFileId: NewFileId): void => {
                    this.drawingPreviewService.id = newFileId.id;
                    this.snackBar.open('Dessin sauvegardé : ' + this.title, undefined, {
                        duration: 4000,
                    });
                },
                (error: Error): void => {
                    this.drawingPreviewService.id = undefined;
                }
            );
    }

    private updateDrawing(): void {
        this.serverService
            // tslint:disable-next-line: no-non-null-assertion
            .updateDrawing(this.drawingPreviewService.id!, this.drawingPreviewService.drawingPreviewRoot.outerHTML)
            .pipe(catchError(this.updateDrawingErrorAlert()))
            .subscribe(
                (): void => {
                    this.snackBar.open('Dessin mis à jour : ' + this.title, undefined, {
                        duration: 4000,
                    });
                },
                (error: Error): void => {
                    this.drawingPreviewService.id = undefined;
                }
            );
    }

    private createDrawingErrorAlert(): (error: Error) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.NotFound:
                    errorMessage = "Erreur: Le dessin à ajouter n'a pas été trouvé.";
                    break;
                case HttpStatusCode.BadRequest:
                    errorMessage = 'Erreur: Requête invalide.';
                    break;
            }

            if (errorMessage !== '') {
                this.snackBar.open(errorMessage, undefined, {
                    duration: 4000,
                });
            }

            return throwError(error);
        };
    }

    private updateDrawingErrorAlert(): (error: Error) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.NotFound:
                    errorMessage = "Erreur: Le dessin à mettre à jour n'a pas été trouvé.";
                    break;
                case HttpStatusCode.BadRequest:
                    errorMessage = 'Erreur: Requête invalide.';
                    break;
            }

            if (errorMessage !== '') {
                this.snackBar.open(errorMessage, undefined, {
                    duration: 4000,
                });
            }

            return throwError(error);
        };
    }
}
