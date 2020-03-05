import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { SafeUrl } from '@angular/platform-browser';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';

export interface Label {
    name: string;
}
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    PreviewFilter = PreviewFilter; // Make enum available to template

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    fileUrl: SafeUrl;

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingPreviewService: DrawingPreviewService) {}

    exportDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        this.fileUrl = this.drawingSerializerService.exportDrawingAsSvg();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.drawingPreviewService.labels.push(value.trim());
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        if (index >= 0) {
            this.drawingPreviewService.labels.splice(index, 1);
        }
    }

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
}
