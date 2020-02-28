import { Component } from '@angular/core';
import { Meta, SafeUrl } from '@angular/platform-browser';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    fileUrl: SafeUrl;
    constructor(private drawingSerializerService: DrawingSerializerService, private meta: Meta) {}

    exportDrawing(): void {
        const metaArray: HTMLMetaElement[] = [];
        const nextMetaElement = this.meta.addTag({ name: 'Sam', content: 'samsam' });
        if (nextMetaElement instanceof HTMLMetaElement) {
            metaArray.push(nextMetaElement);
        }
        this.fileUrl = this.drawingSerializerService.exportCurrentDrawing(metaArray);
    }
}
