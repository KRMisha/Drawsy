import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import Regexes from '@app/constants/regexes';
import { GridService } from '@app/drawing/services/grid.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-settings',
    templateUrl: './grid-settings.component.html',
    styleUrls: ['./grid-settings.component.scss'],
})
export class GridSettingsComponent implements OnInit {
    readonly sliderRange = 100;

    sizeSubscription: Subscription;
    opacitySubscription: Subscription;

    sizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(this.gridService.minimumSize),
                Validators.max(this.gridService.maximumSize),
                Validators.pattern(Regexes.integerRegex),
            ])
        ),
    });

    opacityGroup = new FormGroup({
        opacity: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(this.gridService.minimumOpacity),
                Validators.max(this.gridService.maximumOpacity),
                Validators.pattern(Regexes.decimalRegex),
            ])
        ),
    });

    constructor(private gridService: GridService) {}

    ngOnInit(): void {
        this.sizeGroup.controls.size.setValue(this.gridService.size);
        this.opacityGroup.controls.opacity.setValue(this.gridService.opacity);

        this.sizeSubscription = this.sizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.sizeGroup.controls.size.valid) {
                this.gridService.size = this.sizeGroup.controls.size.value;
            }
        });

        this.opacitySubscription = this.opacityGroup.controls.opacity.valueChanges.subscribe(() => {
            if (this.opacityGroup.controls.opacity.valid) {
                this.gridService.opacity = this.opacityGroup.controls.opacity.value;
            }
        });
    }

    get isGridDisplayEnabled(): boolean {
        return this.gridService.isDisplayEnabled;
    }

    toggleGridDisplay(): void {
        this.gridService.toggleDisplay();
    }

    get gridSize(): number {
        return this.gridService.size;
    }

    set gridSize(gridSize: number) {
        this.gridService.size = gridSize;
    }

    increaseGridSize(): void {
        this.gridService.increaseSize();
    }

    decreaseGridSize(): void {
        this.gridService.decreaseSize();
    }

    getSizeErrorMessage(): string {
        return this.getErrorMessage(this.sizeGroup.controls.size);
    }

    getOpacityErrorMessage(): string {
        return this.getErrorMessage(this.opacityGroup.controls.opacity);
    }

    private getErrorMessage(formControl: AbstractControl): string {
        return formControl.hasError('required')
            ? 'Entrez une taille'
            : formControl.hasError('pattern')
            ? 'Nombre invalide'
            : formControl.hasError('min')
            ? 'Valeur trop petite'
            : formControl.hasError('max')
            ? 'Valeur trop grande'
            : '';
    }
}
