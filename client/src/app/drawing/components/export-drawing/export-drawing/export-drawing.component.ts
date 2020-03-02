import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { SafeUrl } from '@angular/platform-browser';
import { DrawingPreviewTextures } from '@app/drawing/enums/drawing-preview-textures.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

export interface Label {
    name: string;
}
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnDestroy {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    fileUrl: SafeUrl;
    previewTexture: DrawingPreviewTextures = DrawingPreviewTextures.PreviewTexture0;

    labels: string[] = [];
    title: string;

    DrawingPreviewTextures = DrawingPreviewTextures;
    constructor(private drawingSerializerService: DrawingSerializerService, private drawingService: DrawingService) {
        const currentDrawing = this.drawingService.getCurrentDrawing();
        this.labels = currentDrawing.descElements;
        this.title = currentDrawing.title;
    }

    ngOnDestroy(): void {
        this.drawingService.removePreviewTexture();
    }

    exportDrawing(): void {
        this.fileUrl = this.drawingSerializerService.exportCurrentDrawing(this.drawingService.getDrawingRoot());
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.labels.push(value.trim());
            this.drawingService.addDescElement(value.trim());
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        if (index >= 0) {
            this.labels.splice(index, 1);
        }
    }

    getPreviewTexture(): DrawingPreviewTextures {
        return this.previewTexture;
    }

    setPreviewTexture(texture: DrawingPreviewTextures): void {
        this.drawingService.setPreviewTexture(texture);
    }
}
