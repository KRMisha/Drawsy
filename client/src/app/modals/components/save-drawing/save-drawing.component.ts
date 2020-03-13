import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { Subscription } from 'rxjs';
import { descRegex } from '../../../../../../common/validation/desc-regex';

const maxInputStringLength = 15;

export interface Label {
    name: string;
}
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit, OnDestroy {
    PreviewFilter = PreviewFilter; // Make enum available to template

    titleFormSubscription: Subscription;
    labelFormSubscription: Subscription;

    saveDrawingFormGroup = new FormGroup({
        labelForm: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
        titleForm: new FormControl(this.drawingPreviewService.title, [
            Validators.required,
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
        ]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingPreviewService: DrawingPreviewService) {
        this.saveDrawingFormGroup.controls.labelForm.setValue(this.labels);
    }

    ngOnInit(): void {
        this.title = this.drawingPreviewService.title;
        this.labels = this.drawingPreviewService.labels;
        this.titleFormSubscription = this.saveDrawingFormGroup.controls.titleForm.valueChanges.subscribe(() => {
            console.log(this.saveDrawingFormGroup.valid);
            if (this.saveDrawingFormGroup.controls.titleForm.valid) {
                this.title = this.saveDrawingFormGroup.controls.titleForm.value;
            }
        });
        this.labelFormSubscription = this.saveDrawingFormGroup.controls.labelForm.valueChanges.subscribe(() => {
            this.saveDrawingFormGroup.controls.labelForm.updateValueAndValidity({ emitEvent: false });
        });
    }

    ngOnDestroy(): void {
        this.titleFormSubscription.unsubscribe();
    }

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const inputValue = event.value;

        const control = this.saveDrawingFormGroup.controls.labelForm;

        if ((inputValue || '').trim()) {
            control.setErrors(null);
            control.setValue(inputValue);
            control.updateValueAndValidity();
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
                this.labels.push(inputValue);
            }
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        const control = this.saveDrawingFormGroup.controls.labelForm;

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

    protected getLabelError(): string {
<<<<<<< HEAD
        return this.labelForm.hasError('pattern')
=======
        return this.saveDrawingFormGroup.controls.labelForm.hasError('pattern')
>>>>>>> hotfix/save-drawing-form-group
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingFormGroup.controls.labelForm.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    protected getTitleError(): string {
        return this.saveDrawingFormGroup.controls.titleForm.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingFormGroup.controls.titleForm.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : this.saveDrawingFormGroup.controls.titleForm.hasError('required')
            ? 'Titre obligatoire'
            : '';
    }

    protected saveOnServer(): void {
        if (this.saveDrawingFormGroup.valid) {
            console.log('SERVER DOWN');
        }
    }
}
