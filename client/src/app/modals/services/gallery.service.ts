import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { ServerService } from '@app/shared/services/server.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import { SavedFile } from '@common/communication/saved-file';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    private _drawings: SvgFileContainer[] = []; // tslint:disable-line: variable-name
    private _isLoadingComplete = false; // tslint:disable-line: variable-name

    constructor(
        private router: Router,
        private snackbarService: SnackbarService,
        private serverService: ServerService,
        private drawingSerializerService: DrawingSerializerService,
        private drawingService: DrawingService
    ) {}

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
                    this.snackbarService.displayMessage('Dessin supprimé : ' + drawing.title);

                    const drawingToRemoveIndex = this._drawings.indexOf(drawing, 0);
                    if (drawingToRemoveIndex !== -1) {
                        this._drawings.splice(drawingToRemoveIndex, 1);
                    }

                    if (this.drawingService.id === drawing.id) {
                        this.drawingService.id = undefined;
                    }
                },
                (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.NotFound) {
                        this.getAllDrawings();
                    }
                }
            );
    }

    loadDrawing(drawing: SvgFileContainer, isDuplication: boolean): void {
        const drawingLoadOptions = this.drawingSerializerService.getDrawingLoadOptions(drawing);
        if (this.drawingService.loadDrawingWithConfirmation(drawingLoadOptions)) {
            this.snackbarService.displayMessage('Dessin chargé : ' + drawing.title);
            this.router.navigate(['/editor']);
        }

        if (isDuplication) {
            this.drawingService.id = undefined;
        }
    }

    getAllDrawings(): void {
        this._isLoadingComplete = false;

        this.serverService
            .getAllDrawings()
            .pipe(
                finalize(() => {
                    this._isLoadingComplete = true;
                })
            )
            .subscribe(
                (savedFiles: SavedFile[]) => {
                    this._drawings = savedFiles.map((savedFile: SavedFile) =>
                        this.drawingSerializerService.deserializeDrawing(savedFile.content, savedFile.id)
                    );
                },
                (error: HttpErrorResponse) => {
                    this._drawings = [];
                }
            );
    }

    get drawings(): SvgFileContainer[] {
        return this._drawings;
    }

    get isLoadingComplete(): boolean {
        return this._isLoadingComplete;
    }

    private alertDeleteDrawingError(): (error: HttpErrorResponse) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            if (error.status === HttpStatusCode.NotFound) {
                const errorMessage = "Erreur : le dessin à supprimer n'a pas pu être trouvé";
                this.snackbarService.displayMessage(errorMessage);
            }

            return throwError(error);
        };
    }
}
