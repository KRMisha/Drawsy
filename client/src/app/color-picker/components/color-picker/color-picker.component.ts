import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonId } from 'src/app/classes/button-id';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/drawing/services/color.service';
import { ColorPickerService } from 'src/app/color-picker/services/color-picker.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    providers: [{ provide: ColorPickerService, useValue: new ColorPickerService() }],
})
export class ColorPickerComponent {
    hue = 0;
    saturation = 0;
    value = 0;
    alpha = 1;
    hexStr = '000000';
    defaultColorSet = false;

    @Input() isLastColorsDisplayEnabled = true;

    @Input() isColorPickerDisplayEnabled = true;
    @Input()
    set paletteColor(color: Color) {
        this.setColor(color);
    }

    @Input()
    set defaultColor(color: Color) {
        if (!this.defaultColorSet) {
            this.setColor(color);
            this.defaultColorSet = true;
        }
    }

    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Output() previousColorSelected: EventEmitter<Color> = new EventEmitter();

    constructor(private colorService: ColorService, colorPickerService: ColorPickerService) {
        colorPickerService.colorChanged$.subscribe(
            color => {
                this.colorChanged.emit(color);
            }
        )
    }

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
        const color = this.getColor();
        this.hexStr = color.getHex();
        this.colorChanged.emit(color);
    }

    setAlpha(alpha: number) {
        this.alpha = alpha;
        this.colorChanged.emit(this.getColor());
    }

    setSaturationAndValue(saturationAndValue: [number, number]): void {
        this.saturation = saturationAndValue[0];
        this.value = saturationAndValue[1];
        const color = this.getColor();
        this.hexStr = color.getHex();
        this.colorChanged.emit(color);
    }

    updateColorFromHex(color: Color) {
        this.setColor(color);
    }

    getLastColors(): Color[] {
        return this.colorService.getLastColors();
    }

    oldColorClick(event: MouseEvent, color: Color): void {
        if (event.button === ButtonId.Left || event.button === ButtonId.Right) {
            if (event.button === ButtonId.Left) {
                this.colorService.setPrimaryColor(color);
            } else {
                this.colorService.setSecondaryColor(color);
            }
            this.setColor(color);
            this.previousColorSelected.emit();
        }
    }
}
