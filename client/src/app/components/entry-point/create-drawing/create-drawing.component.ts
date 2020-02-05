import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from '../../../classes/color/color';
import { CreateDrawingService } from 'src/app/services/create-drawing.service';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent {
    private drawingWidth: number;
    private drawingHeight: number;
    private drawingColor: Color;

    constructor(public dialogRef: MatDialogRef<CreateDrawingComponent>, private drawingService: CreateDrawingService) {
        this.drawingService.changeColor(new Color(255, 255, 255));
        this.drawingService.changeHeight(0); // TODO: set to window size
        this.drawingService.changeWidth(0); // TODO: set to window size

        drawingService.width$.subscribe((width) => this.drawingWidth = width);
        drawingService.height$.subscribe((height) => this.drawingHeight = height);
        drawingService.color$.subscribe((color) => this.drawingColor = color);
    }

    close(): void {
        this.dialogRef.close();
    }

    newHeight(height: number) {
        // TODO: Sanitize input
        this.drawingHeight = height;
    }

    newWidth(width: number) {
        // TODO: Sanitize input
        this.drawingWidth = width;
    }

    newColor(color: Color) {
        this.drawingColor = color;
    }

    sendData() {
        this.drawingService.changeColor(this.drawingColor);
        this.drawingService.changeHeight(this.drawingHeight);
        this.drawingService.changeWidth(this.drawingWidth);
        this.close();
    }
}
