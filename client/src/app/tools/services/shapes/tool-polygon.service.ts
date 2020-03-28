import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
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
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Polygon, true);
        this.settings.polygonSideCount = ToolDefaults.defaultPolygonSideCount;
    }

    protected getShapeString(): string {
        return 'polygon';
    }

    protected updateShape(shapeArea: Rect, scale: Vec2, shape: SVGGraphicsElement): void {
        const sideCount = this.settings.polygonSideCount!; // tslint:disable-line: no-non-null-assertion
        const points = this.calculatePoints(shapeArea, scale, sideCount);

        let pointsString = '';
        for (const point of points) {
            pointsString += `${point.x}, ${point.y} `;
        }

        this.renderer.setAttribute(shape, 'points', pointsString);
    }

    private calculatePoints(shapeArea: Rect, scale: Vec2, sideCount: number): Vec2[] {
        const points: Vec2[] = [];

        let angle = -Math.PI / 2;
        for (let i = 0; i < sideCount; i++) {
            const point = {
                x: ((Math.cos(angle) * shapeArea.width) / 2) * scale.x + shapeArea.x + shapeArea.width / 2,
                y: ((Math.sin(angle) * shapeArea.height) / 2) * scale.y + shapeArea.y + shapeArea.height / 2,
            } as Vec2;
            points.push(point);
            angle += (2 * Math.PI) / sideCount;
        }

        return points;
    }
}
