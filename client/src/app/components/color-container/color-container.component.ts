import { Component, Input } from '@angular/core';
import { Color, MAX_COLOR_VALUE} from 'src/app/classes/color/color';

@Component({
    selector: 'app-color-container',
    templateUrl: './color-container.component.html',
    styleUrls: ['./color-container.component.scss']
})
export class ColorContainerComponent {
    @Input() color = new Color(MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE, 1);
}
