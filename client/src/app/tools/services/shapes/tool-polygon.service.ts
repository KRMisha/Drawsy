import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import ToolDefaults from '@app/tools/enums/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { StrokeType, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolShape } from './tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolPolygonService extends ToolShape {
    constructor(protected drawingService: DrawingService, protected colorService: ColorService, protected commandService: CommandService) {
        super(drawingService, colorService, commandService, ToolName.Polygon);
        this.isShapeRegular = true;
        this.toolSettings.set(ToolSetting.PolygonSideCount, ToolDefaults.defaultPolygonSideCount);
    }

    protected createNewShape(): SVGElement {
        const polygon: SVGElement = this.renderer.createElement('polygon', 'svg');
        this.renderer.setAttribute(polygon, 'stroke-width', (this.toolSettings.get(ToolSetting.StrokeSize) as number).toString());
        this.renderer.setAttribute(polygon, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(polygon, 'stroke', this.colorService.getSecondaryColor().toRgbaString());
        this.renderer.setAttribute(polygon, 'stroke-linecap', 'round');

        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.FillOnly) {
            this.renderer.setAttribute(polygon, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.BorderOnly) {
            this.renderer.setAttribute(polygon, 'fill', 'none');
        }
        return polygon;
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        const points: Vec2[] = [];
        const numSides = this.toolSettings.get(ToolSetting.PolygonSideCount) as number;

        let angle = -Math.PI / 2;
        for (let i = 0; i < numSides; i++) {
            angle += (2 * Math.PI) / numSides;
            const point = {
                x: ((Math.cos(angle) * shapeArea.width) / 2) * scale.x + shapeArea.x + shapeArea.width / 2,
                y: ((Math.sin(angle) * shapeArea.height) / 2) * scale.y + shapeArea.y + shapeArea.height / 2,
            } as Vec2;
            points.push(point);
        }

        let pointsString = '';
        for (const point of points) {
            pointsString += `${point.x}, ${point.y} `;
        }

        this.renderer.setAttribute(shape, 'points', pointsString);
    }
}
