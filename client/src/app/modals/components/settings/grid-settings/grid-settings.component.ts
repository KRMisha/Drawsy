import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { SettingsService } from '@app/modals/services/settings.service';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
})
export class GridSettingsComponent implements OnInit, OnDestroy {
    private sizeSubscription: Subscription;
    private opacitySubscription: Subscription;

    constructor(private settingsService: SettingsService, private gridService: GridService) {}

    ngOnInit(): void {
        this.sizeSubscription = this.formGroup.controls.gridSize.valueChanges.subscribe(() => {
            if (this.formGroup.controls.gridSize.valid) {
                this.gridService.size = this.formGroup.controls.gridSize.value;
            }
        });

        this.opacitySubscription = this.formGroup.controls.gridOpacity.valueChanges.subscribe(() => {
            if (this.formGroup.controls.gridOpacity.valid) {
                this.gridService.opacity = this.formGroup.controls.gridOpacity.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.sizeSubscription.unsubscribe();
        this.opacitySubscription.unsubscribe();
    }

    toggleGridDisplay(): void {
        this.gridService.toggleDisplay();
    }

    increaseGridSize(): void {
        this.gridService.increaseSize();
        this.formGroup.controls.gridSize.setValue(this.gridService.size, { emitEvent: false });
    }

    decreaseGridSize(): void {
        this.gridService.decreaseSize();
        this.formGroup.controls.gridSize.setValue(this.gridService.size, { emitEvent: false });
    }

    canIncreaseGridSize(): boolean {
        return this.gridService.size < this.gridService.maximumSize;
    }

    canDecreaseGridSize(): boolean {
        return this.gridService.size > this.gridService.minimumSize;
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl);
    }

    get isGridDisplayEnabled(): boolean {
        return this.gridService.isDisplayEnabled;
    }

    get gridSize(): number {
        return this.gridService.size;
    }

    set gridSize(gridSize: number) {
        this.gridService.size = gridSize;
    }

    get gridOpacity(): number {
        return this.gridService.opacity;
    }

    set gridOpacity(gridOpacity: number) {
        this.gridService.opacity = gridOpacity;
        this.formGroup.controls.gridOpacity.setValue(gridOpacity, { emitEvent: false });
    }

    get minGridOpacity(): number {
        return this.gridService.minimumOpacity;
    }

    get maxGridOpacity(): number {
        return this.gridService.maximumOpacity;
    }

    get formGroup(): FormGroup {
        return this.settingsService.settingsFormGroup;
    }
}
