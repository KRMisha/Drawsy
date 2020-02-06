import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';

enum Button {
    LeftClick = 0,
    RightClick = 2
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

    @Input() displayColorPicker = true;
    @Input()
    set setPaletteColor(color: Color) {
        const hsv = color.getHsv();
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
    }

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Output() previousColorSelected: EventEmitter<Color> = new EventEmitter();

    constructor(private colorService: ColorService) {}

    private getColor(): Color {
        const color = new Color(0, 0, 0, 1);
        color.setHsv(this.hue, this.saturation, this.value);
        return color;
    }

    setHue(hue: number): void {
        this.hue = hue;
        const color = this.getColor();
        this.hexString = color.getHex();
        this.colorChanged.emit(color);
    }

    setSaturationAndValue(saturationAndValue: [number, number]): void {
        this.saturation = saturationAndValue[0];
        this.value = saturationAndValue[1];
        const color = this.getColor();
        this.hexString = color.getHex();
        this.colorChanged.emit(color);
    }

    getLastColors(): Color[] {
        return this.colorService.getLastColors();
    }

    setColor(event: MouseEvent, color: Color): void {
        console.log('bonjour');
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
        }
    }

    updateColorHex() {
        if (this.hexString.length !== 6) {
            return;
        }
        const color = new Color(255, 255, 255, 1);
        color.setHex(this.hexString);
        const hsv = color.getHsv();
        console.log(hsv);
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
        this.colorChanged.emit(color);
    }
}
