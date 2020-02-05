import { Component, Input } from '@angular/core';
import { Color } from 'src/app/classes/color/color';

@Component({
    selector: 'app-color-container',
    templateUrl: './color-container.component.html',
    styleUrls: ['./color-container.component.scss']
})
export class ColorContainerComponent {
    @Input() color: Color;
}
