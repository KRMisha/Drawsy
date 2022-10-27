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
        this.settings.smoothingSettings = ToolDefaults.defaultSmoothingSettings;
        this.settings.simplificationSettings = ToolDefaults.defaultSimplificationSettings;
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

        // tslint:disable: no-non-null-assertion
        if (this.settings.simplificationSettings!.isEnabled) {
            this.simplifyPath(this.settings.simplificationSettings!.threshold);
        }

        const pathString = this.settings.smoothingSettings!.isEnabled
        ? this.redrawBezierCurve(this.settings.smoothingSettings!.factor / 100)
        : this.drawSimplePath(this.settings.simplificationSettings!.isEnabled);
        // tslint:enable: no-non-null-assertion

        this.renderer.setAttribute(this.path, 'd', pathString);
    }

    // Distance simplification based on: https://github.com/mourner/simplify-js
    private simplifyPath(threshold: number): void {
        let previousPoint = this.points[0];
        let simplifiedPath = [previousPoint];
    
        for (let i = 1; i < this.points.length; i++) {
            if (Vec2.distance(this.points[i], previousPoint) > threshold) {
                simplifiedPath.push(this.points[i]);
                previousPoint = this.points[i];
            }
        }
    
        const lastPoint = this.points[this.points.length - 1];
        if (previousPoint !== lastPoint) {
            simplifiedPath.push(lastPoint);
        }
    
        this.points = simplifiedPath;
    }

    private drawSimplePath(isUsingSimpliedPath: boolean): string {
        if (!isUsingSimpliedPath) {
            // If no line simplification is done, appending is faster than redrawing the whole line
            // tslint:disable: no-non-null-assertion
            return this.path!.getAttribute('d') + ` L${Tool.mousePosition.x} ${Tool.mousePosition.y}`;
            // tslint:enable: no-non-null-assertion
        }

        let path = `M${this.points[0].x} ${this.points[0].y}`;
        this.points.forEach((point, index) => {
            if (index > 0) {
                path += ` L${point.x} ${point.y}`
            }
        });
        return path;
    }

    // Based on: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
    private redrawBezierCurve(factor: number): string {
        let newPath = `M ${this.points[0].x} ${this.points[0].y}`;
        for (let i = 1; i < this.points.length; i++) {
            const cp1 = this.createControlPoints(this.points[i - 1], this.points[i - 2], this.points[i], false, factor);
            const cp2 = this.createControlPoints(this.points[i], this.points[i - 1], this.points[i + 1], true, factor);

            newPath += `C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${this.points[i].x} ${this.points[i].y} `;
        }
        return newPath;
    }

    private createControlPoints(currentPoint: Vec2, previousPoint: Vec2, nextPoint: Vec2, isReverse: boolean, smoothingFactor: number): Vec2 {
        const previous = previousPoint || currentPoint
        const next = nextPoint || currentPoint

        const angle = Vec2.angle(previous, next) + (isReverse ? Math.PI : 0);
        const length = Vec2.distance(previous, next) * smoothingFactor;
        
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
