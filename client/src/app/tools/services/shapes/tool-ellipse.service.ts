import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolEllipseService extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Ellipse, false);
    }

    protected getShapeString(): string {
        return 'ellipse';
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGGraphicsElement): void {
        this.renderer.setAttribute(shape, 'cx', `${shapeArea.x + shapeArea.width / 2}`);
        this.renderer.setAttribute(shape, 'cy', `${shapeArea.y + shapeArea.height / 2}`);
        this.renderer.setAttribute(shape, 'rx', `${shapeArea.width / 2}`);
        this.renderer.setAttribute(shape, 'ry', `${shapeArea.height / 2}`);
    }
}
