import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import Regexes from '@app/constants/regexes';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-hex-selector',
    templateUrl: './color-hex-selector.component.html',
    styleUrls: ['./color-hex-selector.component.scss'],
})
export class ColorHexSelectorComponent implements OnInit, OnDestroy {
    hexSelectorGroup = new FormGroup({
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

        this.hexCombinedRgbChangedSubscription = this.hexSelectorGroup.controls.hexCombinedRgb.valueChanges.subscribe(() => {
            this.updateHexRgbComponents();
            this.updateColorPicker();
            this.hexSelectorGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexRedChangedSubscription = this.hexSelectorGroup.controls.hexRed.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexGreenChangedSubscription = this.hexSelectorGroup.controls.hexGreen.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorGroup.updateValueAndValidity({ emitEvent: false });
        });

        this.hexBlueChangedSubscription = this.hexSelectorGroup.controls.hexBlue.valueChanges.subscribe(() => {
            this.updateHexCombinedRgb();
            this.updateColorPicker();
            this.hexSelectorGroup.updateValueAndValidity({ emitEvent: false });
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
        this.hexSelectorGroup.updateValueAndValidity();
    }

    get swapTooltip(): string {
        return this.isCombinedHex ? 'Entrée RGB' : 'Entrée hexadécimale';
    }

    private updateHexCombinedRgb(): void {
        const hexCombinedRgbString =
            this.hexSelectorGroup.controls.hexRed.value +
            this.hexSelectorGroup.controls.hexGreen.value +
            this.hexSelectorGroup.controls.hexBlue.value;
        this.hexSelectorGroup.controls.hexCombinedRgb.setValue(hexCombinedRgbString, { emitEvent: false });
    }

    private updateHexRgbComponents(): void {
        const hexCombinedRgbString = this.hexSelectorGroup.controls.hexCombinedRgb.value;

        // tslint:disable: no-magic-numbers
        this.hexSelectorGroup.controls.hexRed.setValue(hexCombinedRgbString.substring(0, 2), { emitEvent: false });
        this.hexSelectorGroup.controls.hexGreen.setValue(hexCombinedRgbString.substring(2, 4), { emitEvent: false });
        this.hexSelectorGroup.controls.hexBlue.setValue(hexCombinedRgbString.substring(4, 6), { emitEvent: false });
        // tslint:enable: no-magic-numbers
    }

    private updateAll(hexCombinedRgbString: string): void {
        this.hexSelectorGroup.controls.hexCombinedRgb.setValue(hexCombinedRgbString, { emitEvent: false });
        this.updateHexRgbComponents();
    }

    private updateColorPicker(): void {
        if (this.hexSelectorGroup.controls.hexCombinedRgb.valid) {
            const color = Color.fromHex(this.hexSelectorGroup.controls.hexCombinedRgb.value);
            color.alpha = this.colorPickerService.alpha;
            this.colorPickerService.setColor(color);
        }
    }
}
