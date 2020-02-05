import { Component, OnInit } from '@angular/core';
import { CreateDrawingService } from 'src/app/services/create-drawing.service';
import { Color } from 'src/app/classes/color/color';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    private drawingWidth: number;
    private drawingHeight: number;
    private backgroundColor: Color;
    
    constructor(private drawingService: CreateDrawingService) {
        drawingService.width$.subscribe((width) => this.drawingWidth = width);
        drawingService.height$.subscribe((height) => this.drawingHeight = height);
        drawingService.color$.subscribe((color) => this.backgroundColor = color);
    }
}
