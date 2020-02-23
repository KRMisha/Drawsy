import { Component, Input } from '@angular/core';
import { Color } from '@app/classes/color';

@Component({
    selector: 'app-color-container',
    templateUrl: './color-container.component.html',
    styleUrls: ['./color-container.component.scss'],
})
export class ColorContainerComponent {
    @Input() color = new Color();

    constructor() {
        this.color.red = Color.maxRgb;
        this.color.green = Color.maxRgb;
        this.color.blue = Color.maxRgb;
    }
}
