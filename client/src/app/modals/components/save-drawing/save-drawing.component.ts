import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
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

    titleSubscription: Subscription;

    saveDrawingGroup = new FormGroup({
        title: new FormControl(this.saveDrawingService.title, [
            Validators.required,
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
        ]),
        labels: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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

    get previewFilter(): PreviewFilter {
        return this.saveDrawingService.previewFilter;
    }
    set previewFilter(previewFilter: PreviewFilter) {
        this.saveDrawingService.previewFilter = previewFilter;
    }

    constructor(private saveDrawingService: SaveDrawingService) {
        this.saveDrawingGroup.controls.labels.setValue(this.saveDrawingService.labels);
    }

    ngOnInit(): void {
        this.saveDrawingService.title = this.saveDrawingService.title;
        this.saveDrawingService.labels = this.saveDrawingService.labels;
        this.titleSubscription = this.saveDrawingGroup.controls.title.valueChanges.subscribe(() => {
            if (this.saveDrawingGroup.controls.title.valid) {
                this.saveDrawingService.title = this.saveDrawingGroup.controls.title.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleSubscription.unsubscribe();
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
        const index = this.labels.indexOf(label);
        const control = this.saveDrawingGroup.controls.labels;

        if (index >= 0) {
            this.labels.splice(index, 1);
        }

        control.markAsDirty();
    }

    getLabelError(): string {
        return this.saveDrawingGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.labels.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    getTitleError(): string {
        return this.saveDrawingGroup.controls.title.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.saveDrawingGroup.controls.title.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : this.saveDrawingGroup.controls.title.hasError('required')
            ? 'Titre obligatoire'
            : '';
    }

    saveOnServer(): void {
        if (this.saveDrawingGroup.valid) {
            this.saveDrawingService.saveDrawing();
        }
    }
}
