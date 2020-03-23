import { Component } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-background-color-settings',
    templateUrl: './background-color-settings.component.html',
    styleUrls: ['./background-color-settings.component.scss'],
})
export class BackgroundColorSettingsComponent {

    constructor(private drawingService: DrawingService) {}

    set color(color: Color) {
        this.drawingService.backgroundColor = color;
    }

    get color(): Color {
        return this.drawingService.backgroundColor;
    }
}
