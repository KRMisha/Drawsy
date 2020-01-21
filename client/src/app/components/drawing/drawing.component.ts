import { Component } from '@angular/core';
import { DrawingService } from '../../services/drawing/drawing.service'

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent {

    constructor(public drawingService: DrawingService) {
    }
}
