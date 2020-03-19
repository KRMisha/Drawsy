import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { ServerService } from '@app/server/services/server.service';
import { NewFileId } from '@common/communication/new-file-id';
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
    PreviewFilter = PreviewFilter; // Make enum available to template

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    titleSubscription: Subscription;

    saveDrawingGroup = new FormGroup({
        title: new FormControl(this.drawingPreviewService.title, [
            Validators.required,
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
        ]),
        labels: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
    });

    constructor(private drawingPreviewService: DrawingPreviewService, private serverService: ServerService, private snackBar: MatSnackBar) {
        this.saveDrawingGroup.controls.labels.setValue(this.labels);
    }

    ngOnInit(): void {
        this.title = this.drawingPreviewService.title;
        this.labels = this.drawingPreviewService.labels;
        this.titleSubscription = this.saveDrawingGroup.controls.title.valueChanges.subscribe(() => {
            if (this.saveDrawingGroup.controls.title.valid) {
                this.title = this.saveDrawingGroup.controls.title.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleSubscription.unsubscribe();
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

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        if (this.drawingPreviewService.id === undefined) {
            this.serverService
                .createDrawing(this.drawingPreviewService.drawingPreviewRoot.outerHTML)
                .subscribe((newFileId: NewFileId): void => {
                    console.log('Drawing created');
                    this.drawingPreviewService.id = newFileId.id;
                });
        } else {
            this.serverService
                .updateDrawing(this.drawingPreviewService.id, this.drawingPreviewService.drawingPreviewRoot.outerHTML)
                .subscribe((): void => {
                    // ERROR HANDLING
                    console.log('Drawing updated');
                });
        }
        this.snackBar.open(`Dessin sauvegardé : ${this.title}`, undefined, {
            duration: 4000,
        });
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
            this.saveDrawing();
        }
    }
}
