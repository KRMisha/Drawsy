import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    // Make enums available to template
    DrawingFilter = DrawingFilter;
    FileType = FileType;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    currentFileType: FileType = FileType.Svg;

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

    exportDrawing(): void {
        if (this.titleFormControl.valid) {
            this.drawingService.title = this.titleFormControl.value;
            this.drawingPreviewService.finalizePreview();
            this.drawingSerializerService.exportDrawing(this.drawingService.title, this.currentFileType);
        }
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl);
    }

    get drawingFilter(): DrawingFilter {
        return this.drawingPreviewService.drawingFilter;
    }

    set drawingFilter(drawingFilter: DrawingFilter) {
        this.drawingPreviewService.drawingFilter = drawingFilter;
    }
}
