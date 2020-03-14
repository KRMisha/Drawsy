import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { ServerService } from '@app/server/services/server.service';
import { Subscription } from 'rxjs';
import { NewFileId } from '../../../../../../common/communication/new-file-id';
import { SavedFile } from '../../../../../../common/communication/saved-file';
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

    saveDrawingFormGroup = new FormGroup({
        labelForm: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
        titleForm: new FormControl(this.drawingPreviewService.title, [
            Validators.required,
            Validators.pattern(descRegex),
            Validators.maxLength(maxInputStringLength),
        ]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingPreviewService: DrawingPreviewService, private serverService: ServerService) {
        this.saveDrawingFormGroup.controls.labelForm.setValue(this.labels);
    }

    ngOnInit(): void {
        this.title = this.drawingPreviewService.title;
        this.labels = this.drawingPreviewService.labels;
        this.titleFormSubscription = this.saveDrawingFormGroup.controls.titleForm.valueChanges.subscribe(() => {
            if (this.saveDrawingFormGroup.controls.titleForm.valid) {
                this.title = this.saveDrawingFormGroup.controls.titleForm.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.titleFormSubscription.unsubscribe();
    }

    saveDrawing(): void {
        this.drawingPreviewService.finalizePreview();
        const svgFileContainer: SvgFileContainer = {
            title: this.title,
            labels: this.labels,
            drawingRoot: this.drawingPreviewService.drawingPreviewRoot,
            id: this.drawingPreviewService.id,
        };
        if (this.id === '') {
            this.serverService.createDrawing(svgFileContainer).subscribe((newFileId: NewFileId): void => {
                console.log('Drawing created');
                this.drawingPreviewService.id = newFileId.id;
            });
        } else {
            this.serverService.updateDrawing(svgFileContainer).subscribe((savedFile: SavedFile): void => {
                // ERROR HANDLING
                console.log('Drawing updated');
            });
        }
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const inputValue = event.value;
        const control = this.saveDrawingFormGroup.controls.labelForm;

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
        const control = this.saveDrawingFormGroup.controls.labelForm;

        if (index >= 0) {
            this.labels.splice(index, 1);
        }

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

    get id(): string {
        return this.drawingPreviewService.id;
    }
    set id(id: string) {
        this.drawingPreviewService.id = this.id;
    }
    get previewFilter(): PreviewFilter {
        return this.drawingPreviewService.previewFilter;
    }
    set previewFilter(previewFilter: PreviewFilter) {
        this.drawingPreviewService.previewFilter = previewFilter;
    }

    protected getLabelError(): string {
        return this.saveDrawingFormGroup.controls.labelForm.hasError('pattern')
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
            this.saveDrawing();
        }
    }
}
