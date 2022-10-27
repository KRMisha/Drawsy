import { RendererFactory2 } from '@angular/core';
import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolData } from '@app/tools/classes/tool-data';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { Tool } from '@app/tools/services/tool';
import { Vec2 } from '@app/shared/classes/vec2';

export abstract class ToolBrush extends Tool {
    private path?: SVGPathElement;
    private points: Vec2[] = [];

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        toolInfo: ToolData
    ) {
        super(rendererFactory, drawingService, colorService, historyService, toolInfo);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
        this.settings.smoothingSetting = ToolDefaults.defaultSmoothingSetting;
    }

    onMouseMove(event: MouseEvent): void {
        if (Tool.isLeftMouseButtonDown && Tool.isMouseInsideDrawing) {
            this.updatePath();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.path = this.createPath();
            this.updatePath();
            this.drawingService.addElement(this.path);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopDrawing();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (Tool.isLeftMouseButtonDown) {
            this.updatePath();
            this.stopDrawing();
        }
    }

    onFocusOut(): void {
        this.stopDrawing();
    }

    onPrimaryColorChange(color: Color): void {
        if (this.path !== undefined) {
            this.renderer.setAttribute(this.path, 'stroke', color.toRgbaString());
        }
    }

    onToolDeselection(): void {
        this.stopDrawing();
    }

    protected createPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');

        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor.toRgbaString());
        // tslint:disable: no-non-null-assertion
        this.renderer.setAttribute(path, 'stroke-width', this.settings.lineWidth!.toString());
        this.renderer.setAttribute(path, 'data-padding', `${this.settings.lineWidth! / 2}`);
        // tslint:enable: no-non-null-assertion
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'd', `M${Tool.mousePosition.x} ${Tool.mousePosition.y}`);
        this.points.push({x: Tool.mousePosition.x, y: Tool.mousePosition.y})

        return path;
    }

    private updatePath(): void {
        if (this.path === undefined) {
            return;
        }

        this.points.push({x: Tool.mousePosition.x, y: Tool.mousePosition.y})

        const pathString = this.settings.smoothingSetting
            ? this.redrawBezierCurve()
            : this.path.getAttribute('d') + ` L${Tool.mousePosition.x} ${Tool.mousePosition.y}`;

        this.renderer.setAttribute(this.path, 'd', pathString);
    }

    private redrawBezierCurve(): string {
        let newPath = `M ${this.points[0].x} ${this.points[0].y}`;
        for (let i = 1; i < this.points.length; i++) {
            const cp1 = this.createControlPoints(this.points[i - 1], this.points[i - 2], this.points[i], false);
            const cp2 = this.createControlPoints(this.points[i], this.points[i - 1], this.points[i + 1], true);

            newPath += `C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${this.points[i].x} ${this.points[i].y} `;
        }
        return newPath;
    }

    // Based on: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
    private createControlPoints(currentPoint: Vec2, previousPoint: Vec2, nextPoint: Vec2, isReverse: boolean): Vec2 {
        const previous = previousPoint || currentPoint
        const next = nextPoint || currentPoint

        const dx = next.x - previous.x;
        const dy = next.y - previous.y;

        const line = {
            length: Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            angle: Math.atan2(dy, dx)
        }

        const smoothing = 0.2
        const angle = line.angle + (isReverse ? Math.PI : 0);
        const length = line.length * smoothing;
        
        return {
            x: currentPoint.x + Math.cos(angle) * length,
            y: currentPoint.y + Math.sin(angle) * length
        };
    }

    private stopDrawing(): void {
        if (this.path === undefined) {
            return;
        }

        this.historyService.addCommand(new AddElementCommand(this.drawingService, this.path));
        this.points = [];
    }
}
