import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import EmailValidation from '@common/validation/email-validation';
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

    drawingFilter = DrawingFilter.None;
    fileType = FileType.Svg;

    exportDrawingFormGroup = new FormGroup({
        title: new FormControl(this.drawingService.title, [
            Validators.required,
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxTitleLength),
        ]),
        emailEnabled: new FormControl(false),
        emailAddress: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(EmailValidation.emailRegex)]),
    });

    @ViewChild('appDrawingPreview')
    private drawingPreview: DrawingPreviewComponent;

    private emailEnabledChangedSubscription: Subscription;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private exportDrawingService: ExportDrawingService,
        private drawingService: DrawingService
    ) {}

    ngOnInit(): void {
        this.emailEnabledChangedSubscription = this.exportDrawingFormGroup.controls.emailEnabled.valueChanges.subscribe(() => {
            this.exportDrawingFormGroup.controls.emailEnabled.value
                ? this.exportDrawingFormGroup.controls.emailAddress.enable()
                : this.exportDrawingFormGroup.controls.emailAddress.disable();
        });
    }

    ngOnDestroy(): void {
        this.emailEnabledChangedSubscription.unsubscribe();
    }

    onSubmit(): void {
        this.drawingService.title = this.exportDrawingFormGroup.controls.title.value;
        this.changeDetectorRef.detectChanges();
        const drawingRoot = this.drawingPreview.drawingRoot.nativeElement;
        this.exportDrawingFormGroup.controls.emailEnabled.value
            ? this.exportDrawingService.emailDrawing(drawingRoot, this.exportDrawingFormGroup.controls.emailAddress.value, this.fileType)
            : this.exportDrawingService.downloadDrawing(drawingRoot, this.fileType);
    }

    getErrorMessage(formControl: AbstractControl, humanFriendlyPattern?: string): string {
        return ErrorMessageService.getErrorMessage(formControl, humanFriendlyPattern);
    }
}
