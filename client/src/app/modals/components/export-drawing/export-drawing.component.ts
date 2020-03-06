import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface Label {
    name: string;
}
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy{
    PreviewFilter = PreviewFilter; // Make enum available to template

    labelFormSubscription: Subscription;

    labelForm = new FormGroup({
        label: new FormControl(
            '',
            [Validators.pattern('^([0-9a-zA-Z\ \-éèîêôçàû])*$'), Validators.required]
        )
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingPreviewService: DrawingPreviewService) {}

    ngOnInit(): void {
        this.labelForm.controls.label.setValue(this.drawingPreviewService.labels);

        this.labelFormSubscription = this.labelForm.controls.label.valueChanges.subscribe(() => {
            const tempLabels = this.labels;
            if (this.labelForm.controls.label.valid) {
                tempLabels.push(this.labelForm.controls.label.value);
                this.labels = tempLabels;
            }
        });
    }

    ngOnDestroy(): void {
        this.labelFormSubscription.unsubscribe();
    }

    exportDrawingAsSvg(): void {
        this.drawingPreviewService.finalizePreview();
        this.drawingSerializerService.exportDrawingAsSvg(this.drawingPreviewService.title);
    }

    exportDrawingAsPng(): void {
        this.drawingPreviewService.finalizePreview();
        this.drawingSerializerService.exportDrawing(this.drawingPreviewService.title + '.png', 'image/png');
    }

    exportDrawingAsJpeg(): void {
        this.drawingPreviewService.finalizePreview();
        this.drawingSerializerService.exportDrawing(this.drawingPreviewService.title + '.jpeg', 'image/jpeg');
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        const control = this.labelForm.controls.label;

        if ((value || '').trim()) {
            control.setErrors(null);
            const tempLabels = this.labels;
            tempLabels.push(value.trim());
            control.setValue(value);
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
            }
            else {
                const index = this.labels.findIndex(value1 => value1 === value.trim());
                if(index !== -1) {
                    this.labels.splice(index, 1);
                }
            }
        }
        else {
            this.labelForm.controls.label.updateValueAndValidity();
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        const control = this.labelForm.controls.label;

        if (index >= 0) {
            this.labels.splice(index, 1);
        }

        control.updateValueAndValidity();
        control.markAsDirty();
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
