import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import DescValidation from '@common/validation/desc-validation';
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

    titleChangedSubscription: Subscription;

    saveDrawingGroup = new FormGroup({
        title: new FormControl(this.saveDrawingService.title, [
            Validators.required,
            Validators.pattern(DescValidation.descRegex),
            Validators.maxLength(DescValidation.maxTitleLength),
        ]),
        labels: new FormControl(this.saveDrawingService.labels, [
            Validators.pattern(DescValidation.descRegex),
            Validators.maxLength(DescValidation.maxLabelLength),
        ]),
    });

    constructor(private saveDrawingService: SaveDrawingService) {}

    ngOnInit(): void {
        this.titleChangedSubscription = this.saveDrawingGroup.controls.title.valueChanges.subscribe(() => {
            if (this.saveDrawingGroup.controls.title.valid) {
                this.saveDrawingService.title = this.saveDrawingGroup.controls.title.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleChangedSubscription.unsubscribe();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const inputValue = event.value;
        const control = this.saveDrawingGroup.controls.labels;

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

        this.saveDrawingGroup.controls.labels.markAsDirty();
    }

    onSubmit(): void {
        this.saveDrawingService.saveDrawing();
    }

    getTitleError(): string {
        return this.saveDrawingGroup.controls.title.hasError('required')
            ? 'Titre obligatoire'
            : this.saveDrawingGroup.controls.title.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.title.hasError('maxLength')
            ? `Longueur maximale de ${DescValidation.maxTitleLength} caractères`
            : '';
    }

    getLabelError(): string {
        return this.saveDrawingGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.labels.hasError('maxLength')
            ? `Longueur maximale de ${DescValidation.maxLabelLength} caractères`
            : '';
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
