import { Component, Input } from '@angular/core';
import { Color, MAX_COLOR_VALUE } from 'src/app/classes/color/color';

@Component({
    selector: 'app-color-container',
    templateUrl: './color-container.component.html',
    styleUrls: ['./color-container.component.scss'],
})
export class ColorContainerComponent {
    @Input() color = new Color();

    constructor() {
        this.color.red = MAX_COLOR_VALUE;
        this.color.green = MAX_COLOR_VALUE;
        this.color.blue = MAX_COLOR_VALUE;
    }
}
