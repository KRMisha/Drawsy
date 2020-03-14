import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { Subscription } from 'rxjs';
import { descRegex } from '../../../../../../common/validation/desc-regex';

const maxInputStringLength = 15;

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy {
    PreviewFilter = PreviewFilter; // Make enum available to template

    titleFormSubscription: Subscription;

    titleForm = new FormControl('Sans titre', [
        Validators.required,
        Validators.pattern(descRegex),
        Validators.maxLength(maxInputStringLength),
    ]);

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingPreviewService: DrawingPreviewService) {}

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
        if (this.titleForm.valid) {
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawingAsSvg(this.drawingPreviewService.title);
        }
    }

    exportDrawingAsPng(): void {
        if (this.titleForm.valid) {
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawing(this.drawingPreviewService.title + '.png', 'image/png');
        }
    }

    exportDrawingAsJpeg(): void {
        if (this.titleForm.valid) {
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawing(this.drawingPreviewService.title + '.jpeg', 'image/jpeg');
        }
    }

    get title(): string {
        return this.drawingPreviewService.title;
    }

    set title(title: string) {
        this.drawingPreviewService.title = title;
    }

    get previewFilter(): PreviewFilter {
        return this.drawingPreviewService.previewFilter;
    }

    set previewFilter(previewFilter: PreviewFilter) {
        this.drawingPreviewService.previewFilter = previewFilter;
    }
}
