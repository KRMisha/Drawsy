import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';

const minimumPointsToEnableBackspace = 4;
const geometryDimension = 2;
const lineClosingPixelTolerance = 3;

@Injectable({
    providedIn: 'root',
})
export class ToolLineService extends Tool {
    private polyline: SVGPolylineElement;
    private previewLine: SVGLineElement;
    private currentlyDrawing = false;
    private mousePosition: Vec2;
    private nextPoint: Vec2;
    private lastPoint: Vec2;
    private isShiftDown = false;

    private points: number[] = [];
    private junctionPoints: SVGCircleElement[] = [];

    private hasJunction: boolean;
    private junctionSize: number;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Size, ToolDefaults.Size);
        this.toolSettings.set(ToolSetting.HasJunction, [false, ToolDefaults.JunctionSize]);
        this.name = 'Ligne';
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.isMouseInside) {
            return;
        }

        this.mousePosition = { x: event.offsetX, y: event.offsetY };
        this.updateNextPointPosition();
        this.lastPoint = this.nextPoint;

        if (this.previewLine === undefined) {
            this.previewLine = this.renderer.createElement('line', 'svg');
            this.renderer.setAttribute(this.previewLine, 'display', 'none');
            this.drawingService.addElement(this.previewLine);
        }

        this.renderer.setAttribute(this.previewLine, 'x1', this.nextPoint.x.toString());
        this.renderer.setAttribute(this.previewLine, 'y1', this.nextPoint.y.toString());
        this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
        this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());

        if (!this.currentlyDrawing) {
            this.polyline = this.createNewPolyline();
            this.updatePreviewLine();
            this.renderer.setAttribute(this.previewLine, 'display', '');
            this.currentlyDrawing = true;
            this.drawingService.addElement(this.polyline);
            this.drawingService.removeElement(this.previewLine);
            this.drawingService.addElement(this.previewLine);
        }

        this.points.push(this.nextPoint.x);
        this.points.push(this.nextPoint.y);
        this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));

        if (this.hasJunction) {
            const circle = this.createNewJunction();
            this.renderer.setAttribute(circle, 'cx', this.nextPoint.x.toString());
            this.renderer.setAttribute(circle, 'cy', this.nextPoint.y.toString());
            this.drawingService.addElement(circle);
        }

        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.updateNextPointPosition();
            this.updatePreviewLinePosition();
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (!this.isMouseInside) {
            return;
        }
        if (this.junctionPoints.length > 0) {
            this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
        }
        this.points.length -= geometryDimension;

        if (!this.isShiftDown) {
            const firstXIndex = 0;
            const firstYIndex = 1;
            const lastXIndex = this.points.length - 2;
            const lastYIndex = this.points.length - 1;

            const deltaX = Math.abs(this.points[firstXIndex] - this.points[lastXIndex]);
            const deltaY = Math.abs(this.points[firstYIndex] - this.points[lastYIndex]);

            if (deltaX <= lineClosingPixelTolerance && deltaY <= lineClosingPixelTolerance) {
                if (this.junctionPoints.length > 0) {
                    this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
                }
                this.points[lastXIndex] = this.points[firstXIndex];
                this.points[lastYIndex] = this.points[firstYIndex];
            }
        }
        this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
        this.junctionPoints.length = 0;
        this.stopDrawing();
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                if (this.currentlyDrawing) {
                    this.drawingService.removeElement(this.polyline);
                    this.stopDrawing();
                    for (const circle of this.junctionPoints) {
                        this.drawingService.removeElement(circle);
                    }
                    this.junctionPoints.length = 0;
                }
                break;
            case 'Shift':
                this.isShiftDown = true;
                this.updateNextPointPosition();
                this.updatePreviewLinePosition();
                break;
            case 'Backspace':
                this.removeLastPointFromLine();
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;
            this.updateNextPointPosition();
            this.updatePreviewLinePosition();
        }
    }

    private removeLastPointFromLine(): void {
        if (this.points.length >= minimumPointsToEnableBackspace) {
            this.points.length = this.points.length - geometryDimension;
            this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
            this.lastPoint.x = this.points[this.points.length - geometryDimension];
            this.lastPoint.y = this.points[this.points.length - 1];
            this.renderer.setAttribute(this.previewLine, 'x1', this.lastPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y1', this.lastPoint.y.toString());

            this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
        }
    }

    private updateNextPointPosition(): void {
        this.nextPoint = this.calculateNextPointPosition(this.lastPoint, this.mousePosition, this.isShiftDown, this.currentlyDrawing);
    }

    private calculateNextPointPosition(lastPoint: Vec2, mousePosition: Vec2, isShiftDown: boolean, currentlyDrawing: boolean): Vec2 {
        if (!currentlyDrawing || !isShiftDown) {
            return mousePosition;
        }

        const maxAngle = 360;
        let angle = (Math.atan2(mousePosition.y - lastPoint.y, mousePosition.x - lastPoint.x) * maxAngle) / 2 / Math.PI;
        const snapAngle = 45;
        angle = Math.round(angle / snapAngle) * snapAngle;
        if (angle <= 0) {
            angle += maxAngle;
        }

        const nextPoint: Vec2 = { x: 0, y: 0 };
        const horizontalAngles = [180, 360]; // tslint:disable-line: no-magic-numbers
        const verticalAngles = [90, 270]; // tslint:disable-line: no-magic-numbers
        // tslint:disable-next-line: prefer-switch (semantically not a switch)
        if (horizontalAngles.includes(angle)) {
            nextPoint.x = mousePosition.x;
            nextPoint.y = lastPoint.y;
        } else if (verticalAngles.includes(angle)) {
            nextPoint.x = lastPoint.x;
            nextPoint.y = mousePosition.y;
        } else {
            nextPoint.x = mousePosition.x;
            nextPoint.y = Math.tan((angle / (maxAngle / 2)) * Math.PI) * (mousePosition.x - lastPoint.x) + lastPoint.y;
        }
        return nextPoint;
    }

    private stopDrawing(): void {
        this.currentlyDrawing = false;
        this.renderer.setAttribute(this.previewLine, 'display', 'none');
        this.points.length = 0;
    }

    private createNewPolyline(): SVGPolylineElement {
        const polyline: SVGPolylineElement = this.renderer.createElement('polyline', 'svg');
        this.renderer.setAttribute(polyline, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(polyline, 'fill', 'none');
        this.renderer.setAttribute(polyline, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(polyline, 'stroke-linecap', 'round');
        this.renderer.setAttribute(polyline, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(polyline, 'points', '');

        const junction = this.toolSettings.get(ToolSetting.HasJunction) as [boolean, number];
        this.hasJunction = junction[0];
        this.junctionSize = junction[1];
        return polyline;
    }

    private createNewJunction(): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(circle, 'r', `${this.junctionSize / 2}`);
        this.renderer.setAttribute(circle, 'fill', this.polyline.getAttribute('stroke') as string);
        this.junctionPoints.push(circle);
        return circle;
    }

    private updatePreviewLinePosition(): void {
        if (this.currentlyDrawing) {
            this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());
        }
    }

    private updatePreviewLine(): void {
        const previewColor = Color.fromColor(this.colorService.getPrimaryColor());
        previewColor.alpha /= 2;

        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
        this.renderer.setAttribute(this.previewLine, 'fill', this.polyline.getAttribute('fill') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-width', this.polyline.getAttribute('stroke-width') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linecap', this.polyline.getAttribute('stroke-linecap') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', this.polyline.getAttribute('stroke-linejoin') as string);
    }
}
