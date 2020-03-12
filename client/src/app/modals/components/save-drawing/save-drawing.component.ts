import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { ServerService } from '@app/server/service/server-service.service';
import { Subscription } from 'rxjs';
import { Message } from '../../../../../../common/communication/message';

const labelPattern = '^([0-9a-zA-Z ])*$';
const titlePattern = '^([0-9a-zA-Z ])*$';
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

    labelForm = new FormControl('', [Validators.pattern(labelPattern), Validators.maxLength(maxInputStringLength)]);

    titleForm = new FormControl(this.drawingPreviewService.title, [
        Validators.required,
        Validators.pattern(titlePattern),
        Validators.maxLength(maxInputStringLength),
    ]);

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private drawingPreviewService: DrawingPreviewService, private serverService: ServerService) {
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
        const svgFileContainer: SvgFileContainer = {
            title: this.title,
            labels: this.labels,
            drawingRoot: this.drawingPreviewService.drawingPreviewRoot,
            id: this.id,
        };
        if (this.id === '') {
            this.serverService.createDrawing(svgFileContainer).subscribe((message: Message): void => {
                // ERROR HANDDLING
            });
        } else {
            this.serverService.updateDrawing(svgFileContainer).subscribe((message: Message): void => {
                // ERROR HANDDLING
                console.log('WHATTTTTTT');
            });
        }
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        const control = this.labelForm;

        if ((value || '').trim()) {
            control.setErrors(null);
            const tempLabels = this.labels;
            tempLabels.push(value.trim());
            control.setValue(value);
            control.updateValueAndValidity();
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
            } else {
                const index = this.labels.findIndex((tmpString: string): boolean => tmpString === value.trim());
                if (index !== -1) {
                    this.labels.splice(index, 1);
                }
            }
        } else {
            control.updateValueAndValidity();
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
        console.log(this.labelForm.hasError('maxlength'));
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
            this.saveDrawing();
        }
    }
}
