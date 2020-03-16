import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { ServerService } from '@app/server/services/server.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SavedFile } from '../../../../../common/communication/saved-file';

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

        this.serverService.deleteDrawing(selectedDrawing.id).subscribe(() => {
            this.getAllDrawings();
        });
        this.snackBar.open(`Dessin supprimé : ${selectedDrawing.title}`, undefined, {
            duration: 4000,
        });
    }

    loadDrawing(selectedDrawing: SvgFileContainer): void {
        if (this.drawingSerializerService.loadSvgDrawing(selectedDrawing)) {
            this.snackBar.open(`Dessin chargé : ${selectedDrawing.title}`, undefined, {
                duration: 4000,
            });
            this.router.navigate(['/editor']);
        }
    }

    async getAllDrawings(): Promise<SvgFileContainer[]> {
        const savedFiles = await this.serverService
            .getAllDrawings()
            .pipe(catchError(this.handleError<SavedFile[]>('getAllDrawings')))
            .toPromise();
        this._drawings = [];
        for (const savedFile of savedFiles) {
            this.drawings.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(savedFile));
        }
        return this.drawings;
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            console.error(error);

            this.snackBar.open('Erreur: ' + request + '\nMessage: ' + error.message, undefined, {
                duration: 4000,
            });

            return of(result as T);
        };
    }
}
