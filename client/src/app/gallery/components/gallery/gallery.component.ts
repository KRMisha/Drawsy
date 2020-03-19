import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { GalleryService } from '@app/gallery/services/gallery.service';
import { descRegex } from '../../../../../../common/validation/desc-regex';

const maxInputStringLength = 15;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    drawings: SvgFileContainer[] = [];
    searchLabels: string[] = [];
    isLoaded = false;

    galleryGroup = new FormGroup({
        labels: new FormControl('', [Validators.pattern(descRegex), Validators.maxLength(maxInputStringLength)]),
    });

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private galleryService: GalleryService) {}

    ngOnInit(): void {
        this.getAllDrawings();
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
        const index = this.searchLabels.indexOf(label, 0);
        const control = this.galleryGroup.controls.labels;

        if (index >= 0) {
            this.searchLabels.splice(index, 1);
        }

        control.markAsDirty();
    }

    getDrawingsWithLabels(): SvgFileContainer[] {
        if (this.searchLabels.length === 0) {
            return this.drawings;
        }

        return this.drawings.filter((drawing: SvgFileContainer) =>
            drawing.labels.some((label: string) => this.searchLabels.includes(label))
        );
    }

    hasDrawings(): boolean {
        return this.drawings.length !== 0;
    }

    getLabelError(): string {
        return this.galleryGroup.controls.labels.hasError('pattern')
            ? '(A-Z, a-z, 0-9) uniquement'
            : this.galleryGroup.controls.labels.hasError('maxlength')
            ? 'Longueur maximale 15 caractères'
            : '';
    }

    deleteDrawing(selectedDrawing: SvgFileContainer): void {
        this.galleryService.deleteDrawing(selectedDrawing);
        this.drawings.splice(this.drawings.indexOf(selectedDrawing), 1);
        this.getAllDrawings();
    }

    loadDrawing(selectedDrawing: SvgFileContainer): void {
        this.galleryService.loadDrawing(selectedDrawing);
    }

    private async getAllDrawings(): Promise<void> {
        this.isLoaded = false;
        await this.galleryService.updateDrawings();
        this.drawings = this.galleryService.drawings;
        this.isLoaded = true;
    }
}
