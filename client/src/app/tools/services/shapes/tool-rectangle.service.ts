import { Injectable, RendererFactory2 } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Rectangle, false);
    }

    protected getShapeString(): string {
        return 'rect';
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'x', shapeArea.x.toString());
        this.renderer.setAttribute(shape, 'y', shapeArea.y.toString());
        this.renderer.setAttribute(shape, 'width', shapeArea.width.toString());
        this.renderer.setAttribute(shape, 'height', shapeArea.height.toString());
    }
}
