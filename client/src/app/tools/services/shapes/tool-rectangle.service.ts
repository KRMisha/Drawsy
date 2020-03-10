import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { StrokeType, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Shape } from './shape';

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends Shape {
    constructor(protected drawingService: DrawingService, protected colorService: ColorService, protected commandService: CommandService) {
        super(drawingService, colorService, commandService, ToolName.Rectangle);
    }

    protected createNewShape(): SVGElement {
        const rectangle: SVGElement = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(rectangle, 'stroke-width', (this.toolSettings.get(ToolSetting.StrokeSize) as number).toString());
        this.renderer.setAttribute(rectangle, 'stroke-linecap', 'square');
        this.renderer.setAttribute(rectangle, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(rectangle, 'stroke', this.colorService.getSecondaryColor().toRgbaString());

        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.FillOnly) {
            this.renderer.setAttribute(rectangle, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.BorderOnly) {
            this.renderer.setAttribute(rectangle, 'fill', 'none');
        }
        return rectangle;
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'x', shapeArea.x.toString());
        this.renderer.setAttribute(shape, 'y', shapeArea.y.toString());
        this.renderer.setAttribute(shape, 'width', shapeArea.width.toString());
        this.renderer.setAttribute(shape, 'height', shapeArea.height.toString());
    }
}
