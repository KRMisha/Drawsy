import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Meta, SafeUrl } from '@angular/platform-browser';
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
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    fileUrl: SafeUrl;
    labels: Label[];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    constructor(private drawingSerializerService: DrawingSerializerService, private meta: Meta) {}

    exportDrawing(): void {
        const metaArray: HTMLMetaElement[] = [];
        const nextMetaElement = this.meta.addTag({ name: 'Sam', content: 'samsam' });
        if (nextMetaElement instanceof HTMLMetaElement) {
            metaArray.push(nextMetaElement);
        }
        this.fileUrl = this.drawingSerializerService.exportCurrentDrawing(metaArray);
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add the label
        if ((value || '').trim()) {
            this.labels.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeLabel(label: Label): void {
        const index = this.labels.indexOf(label);

        if (index >= 0) {
            this.labels.splice(index, 1);
        }
    }
}
