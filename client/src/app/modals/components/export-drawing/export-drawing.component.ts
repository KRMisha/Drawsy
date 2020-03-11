import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { Subscription } from 'rxjs';

const labelPattern = '^([0-9a-zA-Z ])*$';
const titlePattern = '^([0-9a-zA-Z ])*$';
const maxInputStringLength = 15;

export interface Label {
    name: string;
}
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy {
    PreviewFilter = PreviewFilter; // Make enum available to template

    titleFormSubscription: Subscription;

    labelForm = new FormControl('', [Validators.pattern(labelPattern), Validators.maxLength(maxInputStringLength)]);

    titleForm = new FormControl('', [Validators.required, Validators.pattern(titlePattern), Validators.maxLength(maxInputStringLength)]);

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingPreviewService: DrawingPreviewService) {
        this.labelForm.setValue(this.labels);
    }

    ngOnInit(): void {
        this.titleFormSubscription = this.titleForm.valueChanges.subscribe(() => {
            if (this.titleForm.valid) {
                this.title = this.titleForm.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleFormSubscription.unsubscribe();
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

        const control = this.labelForm;

        if ((value || '').trim()) {
            control.setErrors(null);
            const tempLabels = this.labels;
            tempLabels.push(value.trim());
            control.setValue(value);
            control.updateValueAndValidity();
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
            } else {
                const index = this.labels.findIndex((tmpString: string): boolean => tmpString === value.trim());
                if (index !== -1) {
                    this.labels.splice(index, 1);
                }
            }
        } else {
            control.updateValueAndValidity();
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        const control = this.labelForm;

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
