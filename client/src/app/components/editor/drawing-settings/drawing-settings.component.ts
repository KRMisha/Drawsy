import { Component } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from 'src/app/services/drawing/drawing.service';

@Component({
    selector: 'app-drawing-settings',
    templateUrl: './drawing-settings.component.html',
    styleUrls: ['./drawing-settings.component.scss'],
})
export class DrawingSettingsComponent {
    color = new Color();

    constructor(private drawingService: DrawingService) {
        this.color.red = 255;
        this.color.green = 255;
        this.color.blue = 255;
    }

    confirmColor() {
        this.drawingService.backgroundColor = this.color;
    }
}
