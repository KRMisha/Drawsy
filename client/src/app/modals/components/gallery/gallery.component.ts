import { COMMA as Comma, ENTER as Enter } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import MetadataValidation from '@common/validation/metadata-validation';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
    readonly separatorKeysCodes: number[] = [Comma, Enter];

    drawingsWithLabels: SvgFileContainer[];
    searchLabels: string[] = [];

    labelsFormControl = new FormControl('', [
        Validators.pattern(MetadataValidation.contentRegex),
        Validators.maxLength(MetadataValidation.maxLabelLength),
    ]);

    private loadingCompletedSubscription: Subscription;

    constructor(private galleryService: GalleryService) {}

    ngOnInit(): void {
        this.loadingCompletedSubscription = this.galleryService.loadingCompleted$.subscribe(() => {
            this.drawingsWithLabels = this.galleryService.getDrawingsWithLabels(this.searchLabels);
        });
        this.galleryService.getAllDrawings();
    }

    ngOnDestroy(): void {
        this.loadingCompletedSubscription.unsubscribe();
    }

    addLabel(event: MatChipInputEvent): void {
        if (this.labelsFormControl.invalid || event.value === undefined || event.value.trim().length === 0) {
            return;
        }

        this.searchLabels.push(event.value.trim());
        this.drawingsWithLabels = this.galleryService.getDrawingsWithLabels(this.searchLabels);
        event.input.value = '';
    }

    removeLabel(label: string): void {
        const labelIndex = this.searchLabels.indexOf(label, 0);
        if (labelIndex !== -1) {
            this.searchLabels.splice(labelIndex, 1);
            this.drawingsWithLabels = this.galleryService.getDrawingsWithLabels(this.searchLabels);
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

    get isLoadingComplete(): boolean {
        return this.galleryService.isLoadingComplete;
    }
}
