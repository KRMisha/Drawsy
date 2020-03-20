import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { descRegex } from '@common/validation/desc-regex';
import { Subscription } from 'rxjs';

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
    DrawingFilter = DrawingFilter; // Make enum available to template

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    titleChangedSubscription: Subscription;

    saveDrawingGroup = new FormGroup({
        title: new FormControl(this.saveDrawingService.title, [
            Validators.required,
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
        ]),
        labels: new FormControl(this.saveDrawingService.labels, [
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
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

    getLabelError(): string {
        return this.saveDrawingGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.labels.hasError('maxLength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    getTitleError(): string {
        return this.saveDrawingGroup.controls.title.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.title.hasError('maxLength')
            ? 'Longueur maximale 15 caractères'
            : this.saveDrawingGroup.controls.title.hasError('required')
            ? 'Titre obligatoire'
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

    get drawingFilter(): DrawingFilter {
        return this.saveDrawingService.drawingFilter;
    }
    set drawingFilter(drawingFilter: DrawingFilter) {
        this.saveDrawingService.drawingFilter = drawingFilter;
    }
}
