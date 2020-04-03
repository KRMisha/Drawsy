import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
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

    @ViewChild('appDrawingPreview') drawingPreview: DrawingPreviewComponent;

    FileType = FileType;

    currentFileType: FileType = FileType.Svg;

    titleFormControl = new FormControl(this.drawingService.title, [
        Validators.required,
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxTitleLength),
    ]);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingSerializerService: DrawingSerializerService,
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService
    ) {}

    onSubmit(): void {
        this.drawingService.title = this.titleFormControl.value;
        this.changeDetectorRef.detectChanges();
        this.drawingSerializerService.exportDrawing(
            this.drawingService.title,
            this.currentFileType,
            this.drawingPreview.drawingRoot.nativeElement
        );
    }

    getErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.titleFormControl, 'A-Z, a-z, 0-9');
    }

    get drawingFilter(): DrawingFilter {
        return this.drawingPreviewService.drawingFilter;
    }

    set drawingFilter(drawingFilter: DrawingFilter) {
        this.drawingPreviewService.drawingFilter = drawingFilter;
    }
}
