import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Color, hexRegexStr } from 'src/app/classes/color/color';

const singleComponentRegex = new RegExp('^[0-9a-fA-F]{2}$');

@Component({
    selector: 'app-color-hex-selector',
    templateUrl: './color-hex-selector.component.html',
    styleUrls: ['./color-hex-selector.component.scss'],
})
export class ColorHexSelectorComponent {
    hexRgb = new FormControl('000000', [Validators.required, Validators.pattern(hexRegexStr)]);
    hexRed = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    hexGreen = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    hexBlue = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    isHex = true;

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Input()
    set hex(hex: string) {
        this.hexRgb.setValue(hex);
        this.hexRed.setValue(hex.substring(0, 2));
        this.hexGreen.setValue(hex.substring(2, 4));
        this.hexBlue.setValue(hex.substring(4, 6));
    }

    updateColorHex(): void {
        const color = new Color();
        if (color.setHex(this.hexRgb.value)) {
            this.hex = this.hexRgb.value;
            this.colorChanged.emit(color);
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
            this.hex = this.hexRgb.value;
        }
        event.preventDefault();
    }
}
