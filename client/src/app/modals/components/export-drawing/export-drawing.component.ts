import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';
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

    drawingFilter = DrawingFilter.None;
    fileType = FileType.Svg;

    titleFormControl = new FormControl(this.drawingService.title, [
        Validators.required,
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxTitleLength),
    ]);

    @ViewChild('appDrawingPreview') private drawingPreview: DrawingPreviewComponent;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private exportDrawingService: ExportDrawingService,
        private drawingService: DrawingService
    ) {}

    onSubmit(): void {
        this.drawingService.title = this.titleFormControl.value;
        this.changeDetectorRef.detectChanges();
        this.exportDrawingService.exportDrawing(this.drawingPreview.drawingRoot.nativeElement, this.fileType);
    }

    getErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.titleFormControl, 'A-Z, a-z, 0-9');
    }
}
