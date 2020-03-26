import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { snackBarDuration } from '@app/shared/constants/snack-bar-duration';
import { ServerService } from '@app/shared/services/server.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    private _drawings: SvgFileContainer[] = []; // tslint:disable-line: variable-name
    private _areDrawingsLoaded = false; // tslint:disable-line: variable-name

    constructor(
        private serverService: ServerService,
        private router: Router,
        private drawingSerializerService: DrawingSerializerService,
        private snackBar: MatSnackBar,
        private drawingService: DrawingService
    ) {}

    loadDrawing(drawing: SvgFileContainer): void {
        if (this.drawingSerializerService.loadDrawing(drawing)) {
            this.snackBar.open('Dessin chargé : ' + drawing.title, undefined, {
                duration: snackBarDuration,
            });
            this.router.navigate(['/editor']);
        }
    }

    deleteDrawing(drawing: SvgFileContainer): void {
        const confirmationMessage = 'Attention! La suppression du dessin est irréversible. Désirez-vous quand même supprimer le dessin?';
        if (!confirm(confirmationMessage)) {
            return;
        }

        this.serverService
            .deleteDrawing(drawing.id)
            .pipe(catchError(this.alertDeleteDrawingError()))
            .subscribe(
                () => {
                    this.snackBar.open('Dessin supprimé : ' + drawing.title, undefined, {
                        duration: snackBarDuration,
                    });

                    const drawingToRemoveIndex = this._drawings.indexOf(drawing, 0);
                    if (drawingToRemoveIndex >= 0) {
                        this._drawings.splice(drawingToRemoveIndex, 1);
                    }

                    this.drawingService.id = undefined;
                },
                (error: HttpErrorResponse): void => {
                    if (error.status === HttpStatusCode.NotFound) {
                        this.getAllDrawings();
                    }
                }
            );
    }

    getAllDrawings(): void {
        this._areDrawingsLoaded = false;

        this.serverService
            .getAllDrawings()
            .pipe(
                finalize(() => {
                    this._areDrawingsLoaded = true;
                })
            )
            .subscribe((savedFiles: SavedFile[]) => {
                this._drawings = savedFiles.map((savedFile: SavedFile) =>
                    this.drawingSerializerService.makeSvgFileContainerFromSavedFile(savedFile)
                );
            });
    }

    getDrawingsWithLabels(labels: string[]): SvgFileContainer[] {
        if (labels.length === 0) {
            return this._drawings;
        }

        return this._drawings.filter((drawing: SvgFileContainer) => drawing.labels.some((label: string) => labels.includes(label)));
    }

    hasDrawings(): boolean {
        return this._drawings.length > 0;
    }

    get areDrawingsLoaded(): boolean {
        return this._areDrawingsLoaded;
    }

    private alertDeleteDrawingError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            if (error.status === HttpStatusCode.NotFound) {
                const errorMessage = "Erreur : le dessin à supprimer n'a pas pu être trouvé.";
                this.snackBar.open(errorMessage, undefined, {
                    duration: snackBarDuration,
                });
            }

            return throwError(error);
        };
    }
}
