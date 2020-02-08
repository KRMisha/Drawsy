import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { hexRegexStr, Color } from 'src/app/classes/color/color';

const singleComponentRegex = new RegExp('^[0-9a-fA-F]{2}$');

@Component({
    selector: 'app-color-hex-selector',
    templateUrl: './color-hex-selector.component.html',
    styleUrls: ['./color-hex-selector.component.scss'],
})
export class ColorHexSelectorComponent {
    hexForm = new FormControl('000000', [Validators.required, Validators.pattern(hexRegexStr)]);
    redHexForm = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    greenHexForm = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    blueHexForm = new FormControl('00', [Validators.required, Validators.pattern(singleComponentRegex)]);
    isHex = true;

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Input()
    set hex(hex: string) {
        this.hexForm.setValue(hex);
        this.redHexForm.setValue(hex.substring(0, 2));
        this.greenHexForm.setValue(hex.substring(2, 4));
        this.blueHexForm.setValue(hex.substring(4, 6));
    }

    updateColorHex(): void {
        const color = new Color();
        if (color.setHex(this.hexForm.value)) {
            this.hex = this.hexForm.value;
            this.colorChanged.emit(color);
        }
    }

    updateColorRgb(): void {
        if (
            singleComponentRegex.test(this.redHexForm.value) &&
            singleComponentRegex.test(this.greenHexForm.value) &&
            singleComponentRegex.test(this.blueHexForm.value)
        ) {
            this.hexForm.setValue(this.redHexForm.value + this.greenHexForm.value + this.blueHexForm.value);
            this.updateColorHex();
        }
    }

    swapMode(): void {
        this.isHex = !this.isHex;
        if (this.isHex) {
            this.updateColorRgb();
        } else {
            this.hex = this.hexForm.value;
        }
    }
}
