import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
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
    hexString = '000000';
    alpha = 1;

    @Input() displayColorPicker = true;
    @Input()
    set setPaletteColor(color: Color) {
        const hsv = color.getHsv();
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
        this.alpha = color.getRgba()[3];
    }

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Output() previousColorSelected: EventEmitter<Color> = new EventEmitter();

    constructor(private colorService: ColorService) {}

    private getColor(): Color {
        const color = new Color(0, 0, 0, this.alpha);
        color.setHsv(this.hue, this.saturation, this.value);
        return color;
    }

    setHue(hue: number): void {
        this.hue = hue;
        const color = this.getColor();
        this.hexString = color.getHex();
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
            this.alpha = color.getRgba()[3];
            color.setAlpha(this.alpha);
            this.colorChanged.emit(color);
        }
    }

    updateColorHex() {
        if (this.hexString.length !== 6) {
            return;
        }
        const color = new Color(255, 255, 255, this.alpha);
        color.setHex(this.hexString);
        const hsv = color.getHsv();
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
        this.colorChanged.emit(color);
    }
}
