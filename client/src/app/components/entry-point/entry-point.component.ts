import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuideComponent } from '../guide/guide.component';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent implements OnInit {
    continueDrawing: boolean;

    constructor(private dialog: MatDialog) {
        this.continueDrawing = false; // TODO: Service which checks if we can continue drawing
    }

    ngOnInit() {}

    openGuideModal(): void {
        this.dialog.open(GuideComponent, {
            width: '1920px',
            height: '1080px',
        });
    }
}
