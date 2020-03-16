import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { ServerService } from '@app/server/services/server.service';

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
            this.getAllDrawings(); // TODO: move to gallery service
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
        const savedFiles = await this.serverService.getAllDrawings().toPromise();
        this._drawings = [];
        for (const savedFile of savedFiles) {
            this.drawings.push(this.drawingSerializerService.convertSavedFileToSvgFileContainer(savedFile));
        }
        return this.drawings;
    }
}
