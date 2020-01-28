import { Component, OnInit } from '@angular/core';
import { CreateDrawingComponent } from './create-drawing/create-drawing.component';
import { MatDialog } from '@angular/material/dialog';
import { Color } from '../../classes/color';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent implements OnInit {
    continueDrawing: boolean;
    drawingWidth: number;
    drawingHeight: number;
    drawingBackgroundColor: Color;

    constructor(private dialog: MatDialog) { }

    ngOnInit() {
        this.continueDrawing = false; // TODO: Service which checks if we can continue drawing
    }

    openCreateDrawing(): void {
        this.dialog.open(CreateDrawingComponent, {
            width: '500px',
            height: '500px'
            //data: {drawingWidth: this.drawingWidth, drawingHeight: this.drawingHeight, drawingColor: this.drawingBackgroundColor}
        });
    }
}
