import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Color } from '../../../classes/color/color';

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    drawingWidth: number;
    drawingHeigth: number;
    drawingColor: Color;

    constructor(public dialogRef: MatDialogRef<CreateDrawingComponent>) {}

    ngOnInit() {
        this.drawingColor = new Color(255, 255, 255);
        this.drawingHeigth = 0; // TODO: fit to window size
        this.drawingWidth = 0; // TODO: fit to window size
    }

    close(): void {
        this.dialogRef.close();
    }
}
