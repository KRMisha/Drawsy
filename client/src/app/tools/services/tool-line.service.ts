import { Injectable, RendererFactory2 } from '@angular/core';
import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

const coordsPerPoint = 2;

@Injectable({
    providedIn: 'root',
})
export class ToolLineService extends Tool {
    private group: SVGGElement;
    private polyline: SVGPolylineElement;
    private previewLine: SVGLineElement;

    private nextPoint: Vec2;
    private lastPoint: Vec2;

    private isCurrentlyDrawing = false;
    private isShiftDown = false;

    private points: number[] = [];
    private junctionPoints: SVGCircleElement[] = [];

    private isJunctionEnabled: boolean;
    private junctionDiameter: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Line);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
        this.settings.junctionSettings = { ...ToolDefaults.defaultJunctionSettings };
    }

    onMouseMove(event: MouseEvent): void {
        this.updateNextPointPosition();
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing || event.button !== MouseButton.Left) {
            return;
        }

        if (!this.isCurrentlyDrawing) {
            this.startDrawing();
        }

        this.renderer.setAttribute(this.previewLine, 'x1', this.nextPoint.x.toString());
        this.renderer.setAttribute(this.previewLine, 'y1', this.nextPoint.y.toString());
        this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
        this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());

        this.points.push(this.nextPoint.x);
        this.points.push(this.nextPoint.y);
        this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));

        if (this.isJunctionEnabled) {
            const circle = this.createNewJunction();
            this.renderer.setAttribute(circle, 'cx', this.nextPoint.x.toString());
            this.renderer.setAttribute(circle, 'cy', this.nextPoint.y.toString());
            this.renderer.appendChild(this.group, circle);
        }

        this.lastPoint = this.nextPoint;
        this.updateNextPointPosition();
    }

    onMouseDoubleClick(event: MouseEvent): void {
        const removedJunctionPoint = this.junctionPoints.pop();
        if (removedJunctionPoint !== undefined) {
            this.renderer.removeChild(this.group, removedJunctionPoint);
        }
        this.points.length -= coordsPerPoint;

        if (!this.isShiftDown) {
            const firstXIndex = 0;
            const firstYIndex = 1;
            const lastXIndex = this.points.length - 2;
            const lastYIndex = this.points.length - 1;

            const lineClosingPixelTolerance = 3;
            const deltaPosition: Vec2 = {
                x: Math.abs(this.points[firstXIndex] - this.points[lastXIndex]),
                y: Math.abs(this.points[firstYIndex] - this.points[lastYIndex]),
            };
            if (deltaPosition.x <= lineClosingPixelTolerance && deltaPosition.y <= lineClosingPixelTolerance) {
                const removedLastJunctionPoint = this.junctionPoints.pop();
                if (removedLastJunctionPoint !== undefined) {
                    this.renderer.removeChild(this.group, removedLastJunctionPoint);
                }
                this.points[lastXIndex] = this.points[firstXIndex];
                this.points[lastYIndex] = this.points[firstYIndex];
            }
        }
        this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
        this.stopDrawing();
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                if (this.isCurrentlyDrawing) {
                    this.drawingService.removeElement(this.group);
                    this.stopDrawing();
                    this.junctionPoints = [];
                }
                break;
            case 'Shift':
                this.isShiftDown = true;
                this.updateNextPointPosition();
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
        }
    }

    onFocusOut(): void {
        this.stopDrawing();
        this.isShiftDown = false;
    }

    onPrimaryColorChange(color: Color): void {
        if (!this.isCurrentlyDrawing) {
            return;
        }
        this.renderer.setAttribute(this.group, 'stroke', color.toRgbaString());

        const previewColor = this.colorService.primaryColor.clone();
        previewColor.alpha /= 2;
        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
    }

    onToolDeselection(): void {
        this.stopDrawing();
        this.isShiftDown = false;
    }

    private startDrawing(): void {
        // tslint:disable: no-non-null-assertion
        this.isCurrentlyDrawing = true;

        this.isJunctionEnabled = this.settings.junctionSettings!.isEnabled;
        this.junctionDiameter = this.settings.junctionSettings!.diameter;

        const junctionDiameterActualValue = this.isJunctionEnabled ? this.junctionDiameter : 0;
        const padding = Math.max(0, this.settings.lineWidth! / 2 - junctionDiameterActualValue);

        this.group = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(this.group, 'stroke', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(this.group, 'stroke-width', this.settings.lineWidth!.toString());
        this.renderer.setAttribute(this.group, 'data-padding', padding.toString());

        this.drawingService.addElement(this.group);

        this.polyline = this.createNewPolyline();
        this.renderer.appendChild(this.group, this.polyline);

        this.previewLine = this.renderer.createElement('line', 'svg');
        this.drawingService.addUiElement(this.previewLine);

        const previewColor = this.colorService.primaryColor.clone();
        previewColor.alpha /= 2;

        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
        this.renderer.setAttribute(this.previewLine, 'fill', 'none');
        this.renderer.setAttribute(this.previewLine, 'stroke-width', this.settings.lineWidth!.toString());
        this.renderer.setAttribute(this.previewLine, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', 'round');
        // tslint:enable: no-non-null-assertion
    }

    private stopDrawing(): void {
        if (!this.isCurrentlyDrawing) {
            return;
        }

        this.isCurrentlyDrawing = false;
        this.drawingService.removeUiElement(this.previewLine);
        if (this.points.length > coordsPerPoint) {
            this.historyService.addCommand(new AddElementCommand(this.drawingService, this.group));
        } else {
            this.drawingService.removeElement(this.group);
        }
        this.points = [];
        this.junctionPoints = [];
    }

    private removeLastPointFromLine(): void {
        const minimumPointsToEnableBackspace = 2 * coordsPerPoint;
        if (this.points.length >= minimumPointsToEnableBackspace) {
            this.points.length -= coordsPerPoint;
            this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));

            this.lastPoint.x = this.points[this.points.length - coordsPerPoint];
            this.lastPoint.y = this.points[this.points.length - 1];
            this.renderer.setAttribute(this.previewLine, 'x1', this.lastPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y1', this.lastPoint.y.toString());

            const removedJunctionPoint = this.junctionPoints.pop();
            if (removedJunctionPoint !== undefined) {
                this.renderer.removeChild(this.group, removedJunctionPoint);
            }
        }
    }

    private createNewPolyline(): SVGPolylineElement {
        const polyline: SVGPolylineElement = this.renderer.createElement('polyline', 'svg');
        this.renderer.setAttribute(polyline, 'fill', 'none');
        this.renderer.setAttribute(polyline, 'stroke-linecap', 'round');
        this.renderer.setAttribute(polyline, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(polyline, 'points', '');
        return polyline;
    }

    private createNewJunction(): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(circle, 'r', `${this.junctionDiameter / 2}`);
        this.renderer.setAttribute(circle, 'stroke', 'none');
        this.junctionPoints.push(circle);
        return circle;
    }

    private updateNextPointPosition(): void {
        this.nextPoint = this.calculateNextPointPosition(this.lastPoint, Tool.mousePosition, this.isShiftDown, this.isCurrentlyDrawing);
        this.updatePreviewLinePosition();
    }

    private calculateNextPointPosition(lastPoint: Vec2, mousePosition: Vec2, isShiftDown: boolean, isCurrentlyDrawing: boolean): Vec2 {
        if (!isCurrentlyDrawing || !isShiftDown) {
            return mousePosition;
        }

        const maxAngle = 360;
        let angle = (Vec2.angle(lastPoint, mousePosition) * maxAngle) / 2 / Math.PI;
        const snapAngle = 45;
        angle = Math.round(angle / snapAngle) * snapAngle;
        if (angle <= 0) {
            angle += maxAngle;
        }

        const nextPoint: Vec2 = { x: 0, y: 0 };
        const horizontalAngles = [180, 360]; // tslint:disable-line: no-magic-numbers
        const verticalAngles = [90, 270]; // tslint:disable-line: no-magic-numbers

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

    private updatePreviewLinePosition(): void {
        if (this.isCurrentlyDrawing) {
            this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());
        }
    }
}
