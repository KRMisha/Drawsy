import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';

export interface Label {
    name: string;
}
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
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

    constructor(private saveDrawingService: SaveDrawingService) {}

    addLabel(event: MatChipInputEvent): void {
        if (this.saveDrawingFormGroup.controls.labels.invalid || event.value === undefined || event.value.trim().length === 0) {
            return;
        }

        this.labels.push(event.value);
        event.input.value = '';
    }

    removeLabel(label: string): void {
        const labelIndex = this.labels.indexOf(label);
        if (labelIndex >= 0) {
            this.labels.splice(labelIndex, 1);
        }
    }

    onSubmit(): void {
        if (this.saveDrawingFormGroup.valid) {
            this.saveDrawingService.title = this.saveDrawingFormGroup.controls.title.value;
            this.saveDrawingService.saveDrawing();
        }
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, 'A-Z, a-z, 0-9');
    }

    get title(): string {
        return this.saveDrawingService.title;
    }

    get labels(): string[] {
        return this.saveDrawingService.labels;
    }
}
