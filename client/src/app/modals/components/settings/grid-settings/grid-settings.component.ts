import { Component } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { SettingsService } from '@app/modals/services/settings.service';
import { ErrorMessageService } from '@app/services/error-message.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
})
export class GridSettingsComponent {
    sizeSubscription: Subscription;
    opacitySubscription: Subscription;

    constructor(private settingsService: SettingsService, private gridService: GridService) {}

    toggleGridDisplay(): void {
        this.gridService.toggleDisplay();
    }

    increaseGridSize(): void {
        this.gridService.increaseSize();
    }

    decreaseGridSize(): void {
        this.gridService.decreaseSize();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl);
    }

    canIncreaseSize(): boolean {
        return this.gridService.size < this.gridService.maximumSize;
    }

    canDecreaseSize(): boolean {
        return this.gridService.size > this.gridService.minimumSize;
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

    get opacityFormControl(): AbstractControl {
        return this.settingsService.settingsFormGroup.controls.gridOpacity;
    }

    get sizeFormControl(): AbstractControl {
        return this.settingsService.settingsFormGroup.controls.gridSize;
    }

    get formGroup(): FormGroup {
        return this.settingsService.settingsFormGroup;
    }
}
