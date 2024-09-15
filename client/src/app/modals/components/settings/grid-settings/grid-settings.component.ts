import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { SettingsService } from '@app/modals/services/settings.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
})
export class GridSettingsComponent implements OnInit, OnDestroy {
    private gridDisplayEnabledChangedSubscription: Subscription;
    private gridSizeChangedSubscription: Subscription;
    private gridOpacityChangedSubscription: Subscription;

    constructor(
        private settingsService: SettingsService,
        private gridService: GridService
    ) {}

    ngOnInit(): void {
        this.gridDisplayEnabledChangedSubscription = this.formGroup.controls.gridDisplayEnabled.valueChanges.subscribe(() => {
            if (this.formGroup.controls.gridDisplayEnabled.valid) {
                this.isGridDisplayEnabled = this.formGroup.controls.gridDisplayEnabled.value;
            }
        });
        this.gridSizeChangedSubscription = this.formGroup.controls.gridSize.valueChanges.subscribe(() => {
            if (this.formGroup.controls.gridSize.valid) {
                this.gridService.size = this.formGroup.controls.gridSize.value;
            }
        });
        this.gridOpacityChangedSubscription = this.formGroup.controls.gridOpacity.valueChanges.subscribe(() => {
            if (this.formGroup.controls.gridOpacity.valid) {
                this.gridService.opacity = this.formGroup.controls.gridOpacity.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.gridDisplayEnabledChangedSubscription.unsubscribe();
        this.gridSizeChangedSubscription.unsubscribe();
        this.gridOpacityChangedSubscription.unsubscribe();
    }

    getErrorMessage(formControl: AbstractControl, humanFriendlyPattern?: string): string {
        return ErrorMessageService.getErrorMessage(formControl, humanFriendlyPattern);
    }

    get gridSizeVariation(): number {
        return this.gridService.gridSizeVariation;
    }

    get minGridSize(): number {
        return this.gridService.minimumSize;
    }

    get maxGridSize(): number {
        return this.gridService.maximumSize;
    }

    get minGridOpacity(): number {
        return this.gridService.minimumOpacity;
    }

    get maxGridOpacity(): number {
        return this.gridService.maximumOpacity;
    }

    get isGridDisplayEnabled(): boolean {
        return this.gridService.isDisplayEnabled;
    }

    set isGridDisplayEnabled(isGridDisplayEnabled: boolean) {
        this.gridService.isDisplayEnabled = isGridDisplayEnabled;
        if (isGridDisplayEnabled) {
            this.formGroup.controls.gridSize.enable();
            this.formGroup.controls.gridOpacity.enable();
        } else {
            this.formGroup.controls.gridSize.disable();
            this.formGroup.controls.gridOpacity.disable();
        }
    }

    get gridSize(): number {
        return this.gridService.size;
    }

    set gridSize(gridSize: number) {
        this.gridService.size = gridSize;
        this.formGroup.controls.gridSize.setValue(gridSize, {
            emitEvent: false,
        });
    }

    get gridOpacity(): number {
        return this.gridService.opacity;
    }

    set gridOpacity(gridOpacity: number) {
        this.gridService.opacity = gridOpacity;
        this.formGroup.controls.gridOpacity.setValue(gridOpacity, {
            emitEvent: false,
        });
    }

    get formGroup(): FormGroup {
        return this.settingsService.settingsFormGroup;
    }
}
