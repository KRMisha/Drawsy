import { Component } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent {
    hue = 0.0;
    saturation = 0.0;
    value = 0.0;

    constructor(private colorService: ColorService) {
    }

    setHue(hue: number): void {
        this.hue = hue;
    }

    setSaturationAndValue(saturationAndValue: [number, number]): void {
        this.saturation = saturationAndValue[0];
        this.value = saturationAndValue[1];
    }

    getLastColors(): Color[] {
        return this.colorService.getLastColors();
    }
}
