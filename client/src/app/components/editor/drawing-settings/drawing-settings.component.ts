import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from 'src/app/classes/color/color';
import { DrawingService } from 'src/app/services/drawing/drawing.service';

@Component({
    selector: 'app-drawing-settings',
    templateUrl: './drawing-settings.component.html',
    styleUrls: ['./drawing-settings.component.scss'],
})
export class DrawingSettingsComponent {
    color: Color;

    constructor(private dialogRef: MatDialogRef<DrawingSettingsComponent>, private drawingService: DrawingService) {
        this.color = new Color();
        this.color.red = 255;
        this.color.green = 255;
        this.color.blue = 255;
    }

    confirmColor() {
        this.dialogRef.close();
        this.drawingService.backgroundColor = this.color;
    }
}
