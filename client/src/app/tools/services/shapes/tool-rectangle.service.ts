import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Shape } from './shape';

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends Shape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Rectangle);
    }

    protected createNewShape(): SVGElement {
        const rectangle: SVGElement = this.renderer.createElement('rect', 'svg');
        return rectangle;
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'x', shapeArea.x.toString());
        this.renderer.setAttribute(shape, 'y', shapeArea.y.toString());
        this.renderer.setAttribute(shape, 'width', shapeArea.width.toString());
        this.renderer.setAttribute(shape, 'height', shapeArea.height.toString());
    }
}
