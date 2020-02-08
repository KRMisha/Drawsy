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
    alpha = 1;
    hexStr = '000000';

    @Input() isColorPickerDisplayEnabled = true;
    @Input()
    set setPaletteColor(color: Color) {
        this.setColor(color);
    }

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Output() previousColorSelected: EventEmitter<Color> = new EventEmitter();

    constructor(private colorService: ColorService) {}

    private getColor(): Color {
        const color = new Color();
        color.setHsv(this.hue, this.saturation, this.value);
        color.alpha = this.alpha;
        return color;
    }

    private setColor(color: Color): void {
        const hsv = color.getHsv();
        this.hue = hsv[0];
        this.saturation = hsv[1];
        this.value = hsv[2];
        this.alpha = color.alpha;
        this.hexStr = color.getHex();
        this.colorChanged.emit(color);
    }

    setHue(hue: number): void {
        this.hue = hue;
        this.setColor(this.getColor());
    }

    setAlpha(alpha: number) {
        this.alpha = alpha;
        this.colorChanged.emit(this.getColor());
    }

    setSaturationAndValue(saturationAndValue: [number, number]): void {
        this.saturation = saturationAndValue[0];
        this.value = saturationAndValue[1];
        this.setColor(this.getColor());
    }

    updateColorFromHex(color: Color) {
        this.setColor(color);
    }

    getLastColors(): Color[] {
        return this.colorService.getLastColors();
    }

    oldColorClick(event: MouseEvent, color: Color): void {
        if (event.button === Button.LeftClick || event.button === Button.RightClick) {
            if (event.button === Button.LeftClick) {
                this.colorService.setPrimaryColor(color);
            } else {
                this.colorService.setSecondaryColor(color);
            }
            this.setColor(color);
            this.previousColorSelected.emit();
        }
    }
}
