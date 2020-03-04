import { Component } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-drawing-settings',
    templateUrl: './drawing-settings.component.html',
    styleUrls: ['./drawing-settings.component.scss'],
})
export class DrawingSettingsComponent {
    color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    constructor(private drawingService: DrawingService) {}

    confirmColor(): void {
        this.drawingService.backgroundColor = this.color;
    }
}
