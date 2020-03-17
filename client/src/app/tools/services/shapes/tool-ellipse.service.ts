import { Injectable, RendererFactory2 } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolEllipseService extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Ellipse, false);
    }

    protected getShapeString(): string {
        return 'ellipse';
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'cx', `${shapeArea.x + shapeArea.width / 2}`);
        this.renderer.setAttribute(shape, 'cy', `${shapeArea.y + shapeArea.height / 2}`);
        this.renderer.setAttribute(shape, 'rx', `${shapeArea.width / 2}`);
        this.renderer.setAttribute(shape, 'ry', `${shapeArea.height / 2}`);
    }
}
