import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

    labelForm = new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]);

    titleForm = new FormControl(this.drawingPreviewService.title, [
        Validators.required,
        Validators.pattern(descRegex),
        Validators.maxLength(maxInputStringLength),
    ]);

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingPreviewService: DrawingPreviewService) {
        this.labelForm.setValue(this.labels);
    }

    ngOnInit(): void {
        this.title = this.drawingPreviewService.title;
        this.labels = this.drawingPreviewService.labels;
        this.titleFormSubscription = this.titleForm.valueChanges.subscribe(() => {
            if (this.titleForm.valid) {
                this.title = this.titleForm.value;
            }
        });
        this.labelFormSubscription = this.labelForm.valueChanges.subscribe(() => {
            this.labelForm.updateValueAndValidity();
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

        const control = this.labelForm;

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

    protected getLabelError(): string {
        return this.labelForm.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.labelForm.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    protected getTitleError(): string {
        return this.titleForm.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.titleForm.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : this.titleForm.hasError('required')
            ? 'Titre obligatoire'
            : '';
    }

    protected saveOnServer(): void {
        if (this.labelForm.valid && this.titleForm.valid) {
            console.log('SERVER DOWN');
        }
    }
}
