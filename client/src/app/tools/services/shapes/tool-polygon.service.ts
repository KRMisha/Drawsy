import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Shape } from './shape';

@Injectable({
    providedIn: 'root',
})
export class ToolPolygonService extends Shape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Polygon);
        this.toolSettings.set(ToolSetting.PolygonSideCount, ToolDefaults.PolygonSideCount);
    }

    protected createNewShape(): SVGElement {
        const rectangle: SVGElement = this.renderer.createElement('polygon', 'svg');
        return rectangle;
    }

    protected updateShape(shapeArea: Rect, shape: SVGElement): void {
        const points: Vec2[] = [];
        const numSides = this.toolSettings.get(ToolSetting.PolygonSideCount) as number;

        for (let i = 0; i < numSides; i++) {
            const angle = i * 2 * Math.PI / numSides;
            const point = { x: Math.cos(angle) * shapeArea.width / 2, y: Math.sin(angle) * shapeArea.height / 2 } as Vec2;
            points.push(point);
        }

        let pointsStr = ""
        for (const point of points) {
            pointsStr += `${point.x + shapeArea.x + shapeArea.width / 2}, ${point.y + shapeArea.y + shapeArea.height / 2} `;
        }

        this.renderer.setAttribute(shape, 'points', pointsStr);
    }
}
