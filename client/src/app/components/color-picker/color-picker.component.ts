import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Color, hexRegexStr } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';

enum Button {
    LeftClick = 0,
    RightClick = 2,
}

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue = 0.0;
    saturation = 0.0;
    value = 0.0;
    alpha = 1;

    hexForm = new FormControl(this.getColor().getHex(), [Validators.required, Validators.pattern(hexRegexStr)]);

    @Input() isColorPickerDisplayEnabled = true;
    @Input()
    set setPaletteColor(color: Color) {
        const hsv = color.getHsv();
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
        this.alpha = color.alpha;
    }

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Output() previousColorSelected: EventEmitter<Color> = new EventEmitter();

    constructor(private colorService: ColorService) {}

    private getColor(): Color {
        const color = new Color();
        color.setHsv(this.hue, this.saturation, this.value);
        return color;
    }

    setHue(hue: number): void {
        this.hue = hue;
        const color = this.getColor();
        this.hexForm.setValue(color.getHex());
        this.colorChanged.emit(color);
    }

    setAlpha(alpha: number) {
        this.alpha = alpha;
        this.colorChanged.emit(this.getColor());
    }

    setSaturationAndValue(saturationAndValue: [number, number]): void {
        this.saturation = saturationAndValue[0];
        this.value = saturationAndValue[1];
        this.colorChanged.emit(this.getColor());
        this.hexForm.setValue(this.getColor().getHex());
    }

    getLastColors(): Color[] {
        return this.colorService.getLastColors();
    }

    setColor(event: MouseEvent, color: Color): void {
        if (event.button === Button.LeftClick || event.button === Button.RightClick) {
            if (event.button === Button.LeftClick) {
                this.colorService.setPrimaryColor(color);
            } else {
                this.colorService.setSecondaryColor(color);
            }
            this.previousColorSelected.emit();
            const hsv = color.getHsv();
            this.hue = hsv[0];
            this.saturation = hsv[1];
            this.value = hsv[2];
            this.alpha = color.alpha;
            this.colorChanged.emit(color);
        }
    }

    updateColorHex() {
        const color = new Color();
        if (color.setHex(this.hexForm.value)) {
            const hsv = color.getHsv();
            this.hue = hsv[0];
            this.saturation = hsv[1];
            this.value = hsv[2];
            this.colorChanged.emit(color);
        }
    }
}
