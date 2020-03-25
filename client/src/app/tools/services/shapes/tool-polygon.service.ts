import { Injectable, RendererFactory2 } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

@Injectable({
    providedIn: 'root',
})
export class ToolPolygonService extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Polygon, true);
        this.toolSettings.set(ToolSetting.PolygonSideCount, ToolDefaults.defaultPolygonSideCount);
    }

    protected getShapeString(): string {
        return 'polygon';
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        const points: Vec2[] = [];
        const numSides = this.toolSettings.get(ToolSetting.PolygonSideCount) as number;

        let angle = -Math.PI / 2;
        for (let i = 0; i < numSides; i++) {
            const point = {
                x: ((Math.cos(angle) * shapeArea.width) / 2) * scale.x + shapeArea.x + shapeArea.width / 2,
                y: ((Math.sin(angle) * shapeArea.height) / 2) * scale.y + shapeArea.y + shapeArea.height / 2,
            } as Vec2;
            points.push(point);
            angle += (2 * Math.PI) / numSides;
        }

        let pointsString = '';
        for (const point of points) {
            pointsString += `${point.x}, ${point.y} `;
        }

        this.renderer.setAttribute(shape, 'points', pointsString);
    }
}
