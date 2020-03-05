import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { defaultStrokeSize } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { StrokeType, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Shape } from '@app/tools/services/shapes/shape';

@Injectable({
    providedIn: 'root',
})
export class ToolEllipseService extends Shape {
    constructor(protected drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Ellipse);
        this.toolSettings.set(ToolSetting.StrokeSize, defaultStrokeSize);
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
