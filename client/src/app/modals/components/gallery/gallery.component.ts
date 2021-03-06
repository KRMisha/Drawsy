import { COMMA as Comma, ENTER as Enter } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingSortType } from '@app/modals/enums/drawing-sort-type.enum';
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
    // Make enums available to template
    DrawingSortType = DrawingSortType;

    readonly separatorKeysCodes: number[] = [Comma, Enter];

    searchLabels: string[] = [];
    sortType: DrawingSortType = DrawingSortType.Newest;

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
        if (labelIndex !== -1) {
            this.searchLabels.splice(labelIndex, 1);
        }
    }

    loadDrawing(drawing: SvgFileContainer, isDuplication: boolean): void {
        this.galleryService.loadDrawing(drawing, isDuplication);
    }

    deleteDrawing(drawing: SvgFileContainer): void {
        this.galleryService.deleteDrawing(drawing);
    }

    getErrorMessage(): string {
        return ErrorMessageService.getErrorMessage(this.labelsFormControl, 'A-Z, a-z, 0-9');
    }

    get drawings(): SvgFileContainer[] {
        return this.galleryService.drawings;
    }

    get isLoadingComplete(): boolean {
        return this.galleryService.isLoadingComplete;
    }
}
