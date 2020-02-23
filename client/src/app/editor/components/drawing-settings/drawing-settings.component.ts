import { Component } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from 'src/app/drawing/services/drawing.service';

@Component({
    selector: 'app-drawing-settings',
    templateUrl: './drawing-settings.component.html',
    styleUrls: ['./drawing-settings.component.scss'],
})
export class DrawingSettingsComponent {
    color = new Color();

    constructor(private drawingService: DrawingService) {
        this.color.red = Color.maxRgb;
        this.color.green = Color.maxRgb;
        this.color.blue = Color.maxRgb;
    }

    confirmColor(): void {
        this.drawingService.backgroundColor = this.color;
    }
}
