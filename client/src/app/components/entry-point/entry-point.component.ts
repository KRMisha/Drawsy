import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { GuideComponent } from '../guide/guide.component';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent implements OnInit {
    continueDrawing: boolean;

    constructor(private dialog: MatDialog) {}

    ngOnInit() {
        this.continueDrawing = false; // TODO: Service which checks if we can continue drawing
    }

    openCreateDrawing(): void {
        this.dialog.open(CreateDrawingComponent, {
            width: '500px',
            height: '700px',
        });
    }

    openGuideModal(): void {
        this.dialog.open(GuideComponent, {
            width: '1920px',
            height: '1080px',
        });
    }
}
