import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import MetadataValidation from '@common/validation/metadata-validation';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit, OnDestroy {
    // Make enums available to template
    DrawingFilter = DrawingFilter;
    FileType = FileType;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    currentFileType: FileType = FileType.Svg;

    titleFormControlChangedSubscription: Subscription;

    titleFormControl = new FormControl(this.drawingService.title, [
        Validators.required,
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxTitleLength),
    ]);

    constructor(
        private drawingSerializerService: DrawingSerializerService,
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService
    ) {}

    ngOnInit(): void {
        this.titleFormControlChangedSubscription = this.titleFormControl.valueChanges.subscribe(() => {
            if (this.titleFormControl.valid) {
                this.title = this.titleFormControl.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleFormControlChangedSubscription.unsubscribe();
        this.drawingFilter = DrawingFilter.None;
    }

    exportDrawing(fileType: FileType): void {
        if (this.titleFormControl.valid) {
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawing(this.drawingService.title, fileType);
        }
    }

    get title(): string {
        return this.drawingService.title;
    }
    set title(title: string) {
        this.drawingService.title = title;
    }

    get drawingFilter(): DrawingFilter {
        return this.drawingPreviewService.drawingFilter;
    }

    set drawingFilter(drawingFilter: DrawingFilter) {
        this.drawingPreviewService.drawingFilter = drawingFilter;
    }
}
