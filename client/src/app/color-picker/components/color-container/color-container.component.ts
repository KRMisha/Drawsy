import { Component, Input } from '@angular/core';
import { Color, maxColorValue } from '@app/classes/color/color';

@Component({
    selector: 'app-color-container',
    templateUrl: './color-container.component.html',
    styleUrls: ['./color-container.component.scss'],
})
export class ColorContainerComponent {
    @Input() color = new Color();

    constructor() {
        this.color.red = maxColorValue;
        this.color.green = maxColorValue;
        this.color.blue = maxColorValue;
    }
}
