import { Component } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    constructor(private drawingService: DrawingService) {}

    confirmColor(): void {
        this.drawingService.backgroundColor = this.color;
    }
}
