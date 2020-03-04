import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { StrokeTypes, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Shape } from './shape';

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends Shape {
    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Rectangle);
        this.toolSettings.set(ToolSetting.Size, ToolDefaults.Size);
        this.toolSettings.set(ToolSetting.StrokeType, ToolDefaults.StrokeType);
    }

    protected createNewShape(): SVGElement {
        const rectangle: SVGPathElement = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(rectangle, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(rectangle, 'stroke-linecap', 'square');
        this.renderer.setAttribute(rectangle, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(rectangle, 'stroke', this.colorService.getSecondaryColor().toRgbaString());

        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeTypes.FillOnly) {
            this.renderer.setAttribute(rectangle, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeTypes.BorderOnly) {
            this.renderer.setAttribute(rectangle, 'fill', 'none');
        }
        return rectangle;
    }

    protected updateShape(shapeArea: Rect, shape: SVGElement): void {
        this.renderer.setAttribute(shape, 'x', shapeArea.x.toString());
        this.renderer.setAttribute(shape, 'y', shapeArea.y.toString());
        this.renderer.setAttribute(shape, 'width', shapeArea.width.toString());
        this.renderer.setAttribute(shape, 'height', shapeArea.height.toString());
    }
}
