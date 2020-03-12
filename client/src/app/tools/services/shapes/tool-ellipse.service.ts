import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import ToolDefaults from '@app/tools/enums/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { StrokeType, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolEllipseService extends ToolShape {
    constructor(protected drawingService: DrawingService, protected colorService: ColorService, protected commandService: CommandService) {
        super(drawingService, colorService, commandService, ToolName.Ellipse);
        this.toolSettings.set(ToolSetting.StrokeSize, ToolDefaults.defaultStrokeSize);
    }

    protected createNewShape(): SVGElement {
        const ellipse = this.renderer.createElement('ellipse', 'svg');
        this.renderer.setAttribute(ellipse, 'stroke-width', (this.toolSettings.get(ToolSetting.StrokeSize) as number).toString());
        this.renderer.setAttribute(ellipse, 'stroke-linecap', 'square');
        this.renderer.setAttribute(ellipse, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(ellipse, 'stroke', this.colorService.getSecondaryColor().toRgbaString());

        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.FillOnly) {
            this.renderer.setAttribute(ellipse, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.BorderOnly) {
            this.renderer.setAttribute(ellipse, 'fill', 'none');
        }
        return ellipse;
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'cx', (shapeArea.x + shapeArea.width / 2).toString());
        this.renderer.setAttribute(shape, 'cy', (shapeArea.y + shapeArea.height / 2).toString());
        this.renderer.setAttribute(shape, 'rx', (shapeArea.width / 2).toString());
        this.renderer.setAttribute(shape, 'ry', (shapeArea.height / 2).toString());
    }
}
