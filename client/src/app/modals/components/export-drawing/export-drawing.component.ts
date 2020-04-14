import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import EmailValidation from '@common/validation/email-validation';
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
    isSentByEmail = false;

    titleFormControl = new FormControl(this.drawingService.title, [
        Validators.required,
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxTitleLength),
    ]);

    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EmailValidation.emailRegex)]);

    @ViewChild('appDrawingPreview') private drawingPreview: DrawingPreviewComponent;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private exportDrawingService: ExportDrawingService,
        private drawingService: DrawingService
    ) {}

    onSubmit(): void {
        this.drawingService.title = this.titleFormControl.value;
        this.changeDetectorRef.detectChanges();
        const drawingRoot = this.drawingPreview.drawingRoot.nativeElement;
        this.isSentByEmail
            ? this.exportDrawingService.emailDrawing(drawingRoot, this.emailFormControl.value, this.fileType)
            : this.exportDrawingService.downloadDrawing(drawingRoot, this.fileType);
    }

    getErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.titleFormControl, 'A-Z, a-z, 0-9');
    }

    get isInformationValid(): boolean {
        return this.isSentByEmail ? this.titleFormControl.valid && this.emailFormControl.valid : this.titleFormControl.valid;
    }
}
