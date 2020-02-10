import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../../drawing.service';
import { ToolBrush } from '../tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPencilService extends ToolBrush {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.name = 'Crayon';
    }
}
