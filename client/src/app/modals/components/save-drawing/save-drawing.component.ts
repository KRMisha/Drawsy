import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';
import { Subscription } from 'rxjs';

export interface Label {
    name: string;
}
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit, OnDestroy {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    saveDrawingFormGroup = new FormGroup({
        title: new FormControl(this.saveDrawingService.title, [
            Validators.required,
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxTitleLength),
        ]),
        labels: new FormControl(this.saveDrawingService.labels, [
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxLabelLength),
        ]),
    });

    private titleChangedSubscription: Subscription;

    constructor(private saveDrawingService: SaveDrawingService) {}

    ngOnInit(): void {
        this.titleChangedSubscription = this.saveDrawingFormGroup.controls.title.valueChanges.subscribe(() => {
            if (this.saveDrawingFormGroup.controls.title.valid) {
                this.saveDrawingService.title = this.saveDrawingFormGroup.controls.title.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleChangedSubscription.unsubscribe();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const inputValue = event.value;
        const control = this.saveDrawingFormGroup.controls.labels;

        if ((inputValue || '').trim()) {
            control.setErrors(null);
            control.setValue(inputValue);
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
        const labelIndex = this.labels.indexOf(label);
        if (labelIndex >= 0) {
            this.labels.splice(labelIndex, 1);
        }

        this.saveDrawingFormGroup.controls.labels.markAsDirty();
    }

    onSubmit(): void {
        this.saveDrawingService.saveDrawing();
    }

    getTitleError(): string {
        return ErrorMessageService.getErrorMessage(this.saveDrawingFormGroup.controls.title, '(A-Z, a-z, 0-9)');
    }

    getLabelError(): string {
        return ErrorMessageService.getErrorMessage(this.saveDrawingFormGroup.controls.labels, '(A-Z, a-z, 0-9)');
    }

    get title(): string {
        return this.saveDrawingService.title;
    }
    set title(title: string) {
        this.saveDrawingService.title = title;
    }

    get labels(): string[] {
        return this.saveDrawingService.labels;
    }
    set labels(labels: string[]) {
        this.saveDrawingService.labels = labels;
    }
}
