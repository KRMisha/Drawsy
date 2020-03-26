import { COMMA as Comma, ENTER as Enter } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [Comma, Enter];

    labels: string[] = [];

    saveDrawingFormGroup = new FormGroup({
        title: new FormControl(this.drawingService.title, [
            Validators.required,
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxTitleLength),
        ]),
        labels: new FormControl('', [
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxLabelLength),
        ]),
    });

    constructor(private saveDrawingService: SaveDrawingService, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.labels = [...this.drawingService.labels];
    }

    addLabel(event: MatChipInputEvent): void {
        if (this.saveDrawingFormGroup.controls.labels.invalid || event.value === undefined || event.value.trim().length === 0) {
            return;
        }

        this.labels.push(event.value.trim());
        event.input.value = '';
    }

    removeLabel(label: string): void {
        const labelIndex = this.labels.indexOf(label);
        if (labelIndex >= 0) {
            this.labels.splice(labelIndex, 1);
        }
    }

    onSubmit(): void {
        this.drawingService.title = this.saveDrawingFormGroup.controls.title.value;
        this.drawingService.labels = this.labels;
        this.saveDrawingService.saveDrawing();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, 'A-Z, a-z, 0-9');
    }

    isCreateDrawingAction(): boolean {
        return this.drawingService.id === undefined;
    }

    get title(): string {
        return this.drawingService.title;
    }
}
