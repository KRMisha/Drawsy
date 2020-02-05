import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Color } from '../../classes/color/color';
import { GuideComponent } from '../guide/guide.component';
import { CreateDrawingComponent } from './create-drawing/create-drawing.component';

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

    constructor(private dialog: MatDialog) {}

    ngOnInit() {
        this.continueDrawing = false; // TODO: Service which checks if we can continue drawing
    }

    openCreateDrawing(): void {
        this.dialog.open(CreateDrawingComponent, {
            width: '700px',
            height: '800px',
        });
    }

    openGuideModal(): void {
        this.dialog.open(GuideComponent, {
            width: '1920px',
            height: '1080px',
        });
    }
}
