import { Component } from '@angular/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent {
    hue = 0.0;

    setHue(hue: number): void {
        this.hue = hue;
    }
}
