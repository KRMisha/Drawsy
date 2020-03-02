import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Color, hexRegex } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Subscription } from 'rxjs';

const singleComponentRegex = new RegExp('^[0-9a-fA-F]{2}$');

@Component({
    selector: 'app-color-hex-selector',
    templateUrl: './color-hex-selector.component.html',
    styleUrls: ['./color-hex-selector.component.scss'],
})
export class ColorHexSelectorComponent implements OnInit, OnDestroy {
    hexRgb = new FormControl('000000', [Validators.required, Validators.pattern(hexRegex)]);
    hexRed = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    hexGreen = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    hexBlue = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    isHex = true;

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngOnInit(): void {
        this.colorChangedSubscription = this.colorPickerService.colorChanged$.subscribe((color: Color) => {
            const hex = color.getHex();
            this.setHex(hex);
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    private setHex(hex: string): void {
        // tslint:disable: no-magic-numbers
        this.hexRgb.setValue(hex);
        this.hexRed.setValue(hex.substring(0, 2));
        this.hexGreen.setValue(hex.substring(2, 4));
        this.hexBlue.setValue(hex.substring(4, 6));
        // tslint:enable: no-magic-numbers
    }

    updateColorHex(): void {
        if (hexRegex.test(this.hexRgb.value)) {
            const color = new Color();
            color.setHex(this.hexRgb.value);
            color.alpha = this.colorPickerService.alpha;
            this.colorPickerService.setColor(color);
        }
    }

    updateColorRgb(): void {
        const isRedValid = singleComponentRegex.test(this.hexRed.value);
        const isGreenValid = singleComponentRegex.test(this.hexGreen.value);
        const isBlueValid = singleComponentRegex.test(this.hexBlue.value);
        if (isRedValid && isGreenValid && isBlueValid) {
            this.hexRgb.setValue(this.hexRed.value + this.hexGreen.value + this.hexBlue.value);
            this.updateColorHex();
        }
    }

    swapMode(event: MouseEvent): void {
        this.isHex = !this.isHex;
        if (this.isHex) {
            this.updateColorRgb();
        } else {
            this.setHex(this.hexRgb.value);
        }
        event.preventDefault();
    }
}
