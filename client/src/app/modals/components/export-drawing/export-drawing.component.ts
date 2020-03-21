import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import DescValidation from '@common/validation/desc-validation';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy {
    // Make enums available to template
    PreviewFilter = PreviewFilter;
    FileType = FileType;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    titleFormControlChangedSubscription: Subscription;

    titleFormControl = new FormControl(this.drawingPreviewService.title, [
        Validators.required,
        Validators.pattern(DescValidation.descRegex),
        Validators.maxLength(DescValidation.maxTitleLength),
    ]);

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingPreviewService: DrawingPreviewService) {}

    ngOnInit(): void {
        this.titleFormControlChangedSubscription = this.titleFormControl.valueChanges.subscribe(() => {
            if (this.titleFormControl.valid) {
                this.title = this.titleFormControl.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleFormControlChangedSubscription.unsubscribe();
    }

    exportDrawing(fileType: FileType): void {
        if (this.titleFormControl.valid) {
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawing(this.drawingPreviewService.title, fileType);
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
