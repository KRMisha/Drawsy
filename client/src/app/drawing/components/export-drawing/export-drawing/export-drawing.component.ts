import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { SafeUrl } from '@angular/platform-browser';
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
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    fileUrl: SafeUrl;
    labels: Label[] = [];

    constructor(private drawingSerializerService: DrawingSerializerService) {
        this.exportDrawing();
    }

    exportDrawing(): void {
        this.fileUrl = this.drawingSerializerService.exportCurrentDrawing(this.labels);
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        
        if ((value || '').trim()) {
            this.labels.push({ name: value.trim() });
        }

        if (input !== undefined) {
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
