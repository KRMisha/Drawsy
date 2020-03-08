import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridService } from '@app/drawing/services/grid.service';
import { Subscription } from 'rxjs';

const maximumSize = 1000;
const minimumSize = 10;
const maximumOpacity = 1;
const minimumOpacity = 0.1;
const integerRegexPattern = '^[0-9]*$';
const precisionRegexPattern = '^[0-9.]*$';
const sliderRange = 100;

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
    // Make constant available to template
    sliderRange = sliderRange;

    icon = 'grid_off';
    sizeSubscription: Subscription;
    opacitySubscription: Subscription;

    sizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.max(maximumSize),
                Validators.min(minimumSize),
                Validators.pattern(integerRegexPattern),
            ]),
        ),
    });

    opacityGroup = new FormGroup({
        opacity: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.max(maximumOpacity),
                Validators.min(minimumOpacity),
                Validators.pattern(precisionRegexPattern),
            ]),
        ),
    });

    constructor(private gridService: GridService) {}

    ngOnInit(): void {
        this.selectIcon();
        this.sizeGroup.controls.size.setValue(this.gridService.gridSize);
        this.opacityGroup.controls.opacity.setValue(this.gridService.gridOpacity);

        this.sizeSubscription = this.sizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.sizeGroup.controls.size.valid) {
                this.gridService.setGridSize(this.sizeGroup.controls.size.value);
            }
        });

        this.opacitySubscription = this.opacityGroup.controls.opacity.valueChanges.subscribe(() => {
            if (this.opacityGroup.controls.opacity.valid) {
                this.gridService.updateOpacity(this.opacityGroup.controls.opacity.value);
            }
        });
    }

    selectIcon(): void {
        this.gridService.isDisplayed ? (this.icon = 'grid_off') : (this.icon = 'grid_on');
    }

    protected getSizeErrorMessage(): string {
        return this.getErrorMessage(this.sizeGroup.controls.size);
    }

    protected getOpacityErrorMessage(): string {
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
