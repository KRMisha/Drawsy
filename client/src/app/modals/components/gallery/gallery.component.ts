import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { GalleryService } from '@app/modals/services/gallery.service';
import MetadataValidation from '@common/validation/metadata-validation';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    searchLabels: string[] = [];

    galleryGroup = new FormGroup({
        labels: new FormControl('', [
            Validators.pattern(MetadataValidation.contentRegex),
            Validators.maxLength(MetadataValidation.maxLabelLength),
        ]),
    });

    constructor(private galleryService: GalleryService) {}

    ngOnInit(): void {
        this.galleryService.getAllDrawings();
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        const control = this.galleryGroup.controls.labels;

        if ((value || '').trim()) {
            control.setErrors(null);
            control.setValue(value);
            if (control.valid) {
                control.markAsDirty();
                input.value = '';
                this.searchLabels.push(value.trim());
            }
        }

        if (input !== undefined) {
            input.value = '';
        }
    }

    removeLabel(label: string): void {
        const labelIndex = this.searchLabels.indexOf(label, 0);
        if (labelIndex >= 0) {
            this.searchLabels.splice(labelIndex, 1);
        }

        this.galleryGroup.controls.labels.markAsDirty();
    }

    loadDrawing(drawing: SvgFileContainer): void {
        this.galleryService.loadDrawing(drawing);
    }

    deleteDrawing(drawing: SvgFileContainer): void {
        this.galleryService.deleteDrawing(drawing);
    }

    hasDrawings(): boolean {
        return this.galleryService.hasDrawings();
    }

    getLabelError(): string {
        return this.galleryGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.galleryGroup.controls.labels.hasError('maxlength')
            ? `Longueur maximale de ${MetadataValidation.maxLabelLength} caractères`
            : '';
    }

    get areDrawingsLoaded(): boolean {
        return this.galleryService.areDrawingsLoaded;
    }

    get drawingsWithLabels(): SvgFileContainer[] {
        return this.galleryService.getDrawingsWithLabels(this.searchLabels);
    }
}
