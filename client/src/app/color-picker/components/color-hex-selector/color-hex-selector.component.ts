import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import Regexes from '@app/shared/constants/regexes';
import { merge, Subscription } from 'rxjs';

@Component({
    selector: 'app-color-hex-selector',
    templateUrl: './color-hex-selector.component.html',
    styleUrls: ['./color-hex-selector.component.scss'],
})
export class ColorHexSelectorComponent implements OnInit, OnDestroy {
    hexSelectorFormGroup = new FormGroup({
        hexCombinedRgb: new FormControl('000000', [Validators.required, Validators.pattern(Regexes.sixHexRegex)]),
        hexRed: new FormControl('00', [Validators.required, Validators.pattern(Regexes.twoHexRegex)]),
        hexGreen: new FormControl('00', [Validators.required, Validators.pattern(Regexes.twoHexRegex)]),
        hexBlue: new FormControl('00', [Validators.required, Validators.pattern(Regexes.twoHexRegex)]),
    });
    isCombinedHex = true;

    private colorChangedSubscription: Subscription;
    private hexCombinedRgbChangedSubscription: Subscription;
    private hexRgbComponentChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngOnInit(): void {
        this.colorChangedSubscription = merge(
            this.colorPickerService.hueChanged$,
            this.colorPickerService.saturationChanged$,
            this.colorPickerService.valueChanged$,
            this.colorPickerService.alphaChanged$
        ).subscribe(() => {
            this.updateAll(this.colorPickerService.getColor().getHex());
        });

        this.hexCombinedRgbChangedSubscription = this.hexSelectorFormGroup.controls.hexCombinedRgb.valueChanges.subscribe(() => {
            this.updateHexRgbComponents();
            this.updateColorPicker();
        });

        this.hexRgbComponentChangedSubscription = merge(
            this.hexSelectorFormGroup.controls.hexRed.valueChanges,
            this.hexSelectorFormGroup.controls.hexGreen.valueChanges,
            this.hexSelectorFormGroup.controls.hexBlue.valueChanges
        ).subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
        this.hexCombinedRgbChangedSubscription.unsubscribe();
        this.hexRgbComponentChangedSubscription.unsubscribe();
    }

    swapMode(event: MouseEvent): void {
        this.isCombinedHex = !this.isCombinedHex;
    }

    private updateHexCombinedRgb(): void {
        const hexCombinedRgbString =
            this.hexSelectorFormGroup.controls.hexRed.value +
            this.hexSelectorFormGroup.controls.hexGreen.value +
            this.hexSelectorFormGroup.controls.hexBlue.value;
        this.hexSelectorFormGroup.controls.hexCombinedRgb.setValue(hexCombinedRgbString, { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexCombinedRgb.markAsTouched();
    }

    private updateHexRgbComponents(): void {
        const hexCombinedRgbString = this.hexSelectorFormGroup.controls.hexCombinedRgb.value;

        // tslint:disable: no-magic-numbers
        this.hexSelectorFormGroup.controls.hexRed.setValue(hexCombinedRgbString.substring(0, 2), { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexRed.markAsTouched();
        this.hexSelectorFormGroup.controls.hexGreen.setValue(hexCombinedRgbString.substring(2, 4), { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexGreen.markAsTouched();
        this.hexSelectorFormGroup.controls.hexBlue.setValue(hexCombinedRgbString.substring(4, 6), { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexBlue.markAsTouched();
        // tslint:enable: no-magic-numbers
    }

    private updateAll(hexCombinedRgbString: string): void {
        this.hexSelectorFormGroup.controls.hexCombinedRgb.setValue(hexCombinedRgbString, { emitEvent: false });
        this.updateHexRgbComponents();
    }

    private updateColorPicker(): void {
        if (this.hexSelectorFormGroup.controls.hexCombinedRgb.valid) {
            const color = Color.fromHex(this.hexSelectorFormGroup.controls.hexCombinedRgb.value);
            color.alpha = this.colorPickerService.alpha;
            this.colorPickerService.setColor(color);
        }
    }
}
