import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent implements OnInit {
    continueDrawing: boolean;

    constructor() {
        this.continueDrawing = false; // TODO: Service which checks if we can continue drawing
    }

    ngOnInit() {}
}
