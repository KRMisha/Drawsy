import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { ServerService } from '@app/server/services/server.service';
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
        private snackBar: MatSnackBar,
    ) {}

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        if (this.drawingPreviewService.id === undefined) {
            this.serverService
                .createDrawing(this.drawingPreviewService.drawingPreviewRoot.outerHTML)
                .subscribe((newFileId: NewFileId): void => {
                    console.log('Drawing created');
                    this.drawingPreviewService.id = newFileId.id;
                });
        } else {
            this.serverService
                .updateDrawing(this.drawingPreviewService.id, this.drawingPreviewService.drawingPreviewRoot.outerHTML)
                .subscribe((): void => {
                    // ERROR HANDLING
                    console.log('Drawing updated');
                });
        }
        this.snackBar.open(`Dessin sauvegardé : ${this.title}`, undefined, {
            duration: 4000,
        });
    }
}
