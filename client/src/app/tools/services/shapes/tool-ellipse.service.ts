import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Shape } from './shape';

@Injectable({
    providedIn: 'root',
})
export class ToolEllipseService extends Shape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Ellipse);
    }
}
