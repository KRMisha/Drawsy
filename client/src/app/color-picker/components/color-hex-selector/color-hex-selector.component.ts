import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import Regexes from '@app/shared/constants/regexes';
import { Subscription } from 'rxjs';

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
    private hexRedChangedSubscription: Subscription;
    private hexGreenChangedSubscription: Subscription;
    private hexBlueChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngOnInit(): void {
        this.updateAll(this.colorPickerService.getColor().getHex());

        this.colorChangedSubscription = this.colorPickerService.colorChanged$.subscribe((color: Color) => {
            this.updateAll(color.getHex());
        });

        this.hexCombinedRgbChangedSubscription = this.hexSelectorFormGroup.controls.hexCombinedRgb.valueChanges.subscribe(() => {
            this.updateHexRgbComponents();
            this.updateColorPicker();
            this.hexSelectorFormGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexRedChangedSubscription = this.hexSelectorFormGroup.controls.hexRed.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorFormGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexGreenChangedSubscription = this.hexSelectorFormGroup.controls.hexGreen.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorFormGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexBlueChangedSubscription = this.hexSelectorFormGroup.controls.hexBlue.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorFormGroup.updateValueAndValidity({ emitEvent: false });
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
        this.hexCombinedRgbChangedSubscription.unsubscribe();
        this.hexRedChangedSubscription.unsubscribe();
        this.hexGreenChangedSubscription.unsubscribe();
        this.hexBlueChangedSubscription.unsubscribe();
    }

    swapMode(event: MouseEvent): void {
        this.isCombinedHex = !this.isCombinedHex;
        event.preventDefault();
        this.hexSelectorFormGroup.updateValueAndValidity();
    }

    private updateHexCombinedRgb(): void {
        const hexCombinedRgbString =
            this.hexSelectorFormGroup.controls.hexRed.value +
            this.hexSelectorFormGroup.controls.hexGreen.value +
            this.hexSelectorFormGroup.controls.hexBlue.value;
        this.hexSelectorFormGroup.controls.hexCombinedRgb.setValue(hexCombinedRgbString, { emitEvent: false });
    }

    private updateHexRgbComponents(): void {
        const hexCombinedRgbString = this.hexSelectorFormGroup.controls.hexCombinedRgb.value;

        // tslint:disable: no-magic-numbers
        this.hexSelectorFormGroup.controls.hexRed.setValue(hexCombinedRgbString.substring(0, 2), { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexGreen.setValue(hexCombinedRgbString.substring(2, 4), { emitEvent: false });
        this.hexSelectorFormGroup.controls.hexBlue.setValue(hexCombinedRgbString.substring(4, 6), { emitEvent: false });
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
