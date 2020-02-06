import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';

const leftClick = 0;
const rightClick = 1;

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue = 0.0;
    saturation = 0.0;
    value = 0.0;

    @Input() displayColorPicker = false;

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
        if (event.button === leftClick) {
            this.colorService.setPrimaryColor(color);
            this.previousColorSelected.emit();
        } else if (event.button === rightClick) {
            this.colorService.setSecondaryColor(color);
            this.previousColorSelected.emit();
        }
    }
}
