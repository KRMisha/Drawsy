import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';

@Component({
    selector: 'app-background-color-settings',
    templateUrl: './background-color-settings.component.html',
    styleUrls: ['./background-color-settings.component.scss'],
})
export class BackgroundColorSettingsComponent {
    constructor(private drawingService: DrawingService) {}

    get color(): Color {
        return this.drawingService.backgroundColor;
    }

    set color(color: Color) {
        this.drawingService.backgroundColor = color;
    }
}
