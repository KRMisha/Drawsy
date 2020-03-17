import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { ServerService } from '@app/server/services/server.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../common/communication/http-status-code.enum';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    private _drawings: SvgFileContainer[] = []; // tslint:disable-line: variable-name
    get drawings(): SvgFileContainer[] {
        return this._drawings;
    }

    constructor(
        private serverService: ServerService,
        private router: Router,
        private drawingSerializerService: DrawingSerializerService,
        private snackBar: MatSnackBar,
    ) {}

    deleteDrawing(selectedDrawing: SvgFileContainer): void {
        const confirmationMessage = 'Attention! La suppression du dessin est irréversible. Désirez-vous quand même supprimer le dessin?';
        if (!confirm(confirmationMessage)) {
            return;
        }

        this.serverService
            .deleteDrawing(selectedDrawing.id)
            .pipe(catchError(this.deleteDrawingErrorAlert()))
            .subscribe(
                () => {
                    this.snackBar.open(`Dessin supprimé : ${selectedDrawing.title}`, undefined, {
                        duration: 4000,
                    });
                    this.updateDrawings();
                },
                (error: Error) => {
                    return;
                },
            );
    }

    loadDrawing(selectedDrawing: SvgFileContainer): void {
        if (this.drawingSerializerService.loadSvgDrawing(selectedDrawing)) {
            this.snackBar.open(`Dessin chargé : ${selectedDrawing.title}`, undefined, {
                duration: 4000,
            });
            this.router.navigate(['/editor']);
        }
    }

    async updateDrawings(): Promise<void> {
        this._drawings = [];
        try {
            const savedFiles = await this.serverService
                .getAllDrawings()
                .pipe(catchError(this.getAllDrawingsErrorAlert()))
                .toPromise();
            for (const savedFile of savedFiles) {
                this.drawings.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(savedFile));
            }
        } catch (error) {} // tslint:disable-line: no-empty
    }

    private getAllDrawingsErrorAlert(): (error: Error) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.NotFound:
                    errorMessage = "Erreur: Les dessins n'ont pas été trouvés.";
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

    private deleteDrawingErrorAlert(): (error: Error) => Observable<never> {
        return (error: HttpErrorResponse): Observable<never> => {
            let errorMessage = '';
            switch (error.status) {
                case HttpStatusCode.NotFound:
                    errorMessage = "Erreur: Le dessin à supprimer n'a pas été trouvé.";
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
