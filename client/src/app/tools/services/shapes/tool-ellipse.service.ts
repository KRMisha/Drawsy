import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
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

    protected createNewShape(): SVGElement {
        const ellipse = this.renderer.createElement('ellipse', 'svg');
        return ellipse;
    }

    protected updateShape(shapeArea: Rect, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'cx', (shapeArea.x + shapeArea.width / 2).toString());
        this.renderer.setAttribute(shape, 'cy', (shapeArea.y + shapeArea.height / 2).toString());
        this.renderer.setAttribute(shape, 'rx', (shapeArea.width / 2).toString());
        this.renderer.setAttribute(shape, 'ry', (shapeArea.height / 2).toString());
    }
}
