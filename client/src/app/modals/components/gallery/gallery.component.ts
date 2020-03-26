import { COMMA as Comma, ENTER as Enter } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [Comma, Enter];

    searchLabels: string[] = [];

    labelsFormControl = new FormControl('', [
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxLabelLength),
    ]);

    constructor(private galleryService: GalleryService) {}

    ngOnInit(): void {
        this.galleryService.getAllDrawings();
    }

    addLabel(event: MatChipInputEvent): void {
        if (this.labelsFormControl.invalid || event.value === undefined || event.value.trim().length === 0) {
            return;
        }

        this.searchLabels.push(event.value.trim());
        event.input.value = '';
    }

    removeLabel(label: string): void {
        const labelIndex = this.searchLabels.indexOf(label, 0);
        if (labelIndex >= 0) {
            this.searchLabels.splice(labelIndex, 1);
        }
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

    getErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.labelsFormControl, 'A-Z, a-z, 0-9');
    }

    get areDrawingsLoaded(): boolean {
        return this.galleryService.areDrawingsLoaded;
    }

    get drawingsWithLabels(): SvgFileContainer[] {
        return this.galleryService.getDrawingsWithLabels(this.searchLabels);
    }
}
