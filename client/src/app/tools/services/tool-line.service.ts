import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

const pointsPerCoordinates = 2;

@Injectable({
    providedIn: 'root',
})
export class ToolLineService extends Tool {
    private groupElement: SVGGElement;
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
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Line);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
        this.settings.junctionSettings = ToolDefaults.defaultJunctionSettings;
    }

    static calculateNextPointPosition(lastPoint: Vec2, mousePosition: Vec2, isShiftDown: boolean, isCurrentlyDrawing: boolean): Vec2 {
        if (!isCurrentlyDrawing || !isShiftDown) {
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

    onMouseMove(): void {
        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing) {
            this.stopDrawing();
            return;
        }

        if (event.button !== MouseButton.Left) {
            return;
        }

        if (!this.isCurrentlyDrawing) {
            this.startDrawingShape();
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
            this.renderer.appendChild(this.groupElement, circle);
        }

        this.lastPoint = this.nextPoint;
        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDoubleClick(event: MouseEvent): void {
        const removedJunctionPoint = this.junctionPoints.pop();
        if (removedJunctionPoint !== undefined) {
            this.renderer.removeChild(this.groupElement, removedJunctionPoint);
        }
        this.points.length -= pointsPerCoordinates;

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
                const removedLastJunctionPoint =  this.junctionPoints.pop();
                if (removedJunctionPoint !== undefined) {
                    this.renderer.removeChild(this.groupElement, removedJunctionPoint);
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
                if (this.isCurrentlyDrawing) {
                    this.drawingService.removeElement(this.groupElement);
                    this.stopDrawing();
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

    onPrimaryColorChange(color: Color): void {
        if (!this.isCurrentlyDrawing) {
            return;
        }
        this.renderer.setAttribute(this.groupElement, 'stroke', color.toRgbaString());

        const previewColor = this.colorService.primaryColor.clone();
        previewColor.alpha /= 2;
        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
    }

    onToolDeselection(): void {
        this.stopDrawing();
    }

    private startDrawingShape(): void {
        // tslint:disable: no-non-null-assertion
        this.isCurrentlyDrawing = true;

        ({ isEnabled: this.isJunctionEnabled, diameter: this.junctionDiameter } = this.settings.junctionSettings!);

        const junctionDiameterActualValue = this.isJunctionEnabled ? this.junctionDiameter : 0;
        const padding = Math.max(0, this.settings.lineWidth! / 2 - junctionDiameterActualValue);

        this.groupElement = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.groupElement, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(this.groupElement, 'stroke', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(this.groupElement, 'stroke-width', this.settings.lineWidth!.toString());
        this.renderer.setAttribute(this.groupElement, 'data-padding', padding.toString());

        this.drawingService.addElement(this.groupElement);

        this.polyline = this.createNewPolyline();
        this.renderer.appendChild(this.groupElement, this.polyline);

        this.previewLine = this.renderer.createElement('line', 'svg');
        this.drawingService.addUiElement(this.previewLine);

        const previewColor = this.colorService.primaryColor.clone();
        previewColor.alpha /= 2;

        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
        this.renderer.setAttribute(this.previewLine, 'fill', this.polyline.getAttribute('fill') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-width', this.groupElement.getAttribute('stroke-width') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linecap', this.polyline.getAttribute('stroke-linecap') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', this.polyline.getAttribute('stroke-linejoin') as string);
        // tslint:enable: no-non-null-assertion
    }

    private stopDrawing(): void {
        if (!this.isCurrentlyDrawing) {
            return;
        }
        this.isCurrentlyDrawing = false;
        this.drawingService.removeUiElement(this.previewLine);
        if (this.points.length > pointsPerCoordinates) {
            this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.groupElement));
        } else {
            this.drawingService.removeElement(this.groupElement);
        }
        this.points.length = 0;
    }

    private removeLastPointFromLine(): void {
        const minimumPointsToEnableBackspace = 2 * pointsPerCoordinates;
        if (this.points.length >= minimumPointsToEnableBackspace) {
            this.points.length -= pointsPerCoordinates;
            this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));

            this.lastPoint.x = this.points[this.points.length - pointsPerCoordinates];
            this.lastPoint.y = this.points[this.points.length - 1];
            this.renderer.setAttribute(this.previewLine, 'x1', this.lastPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y1', this.lastPoint.y.toString());

            const removedJunctionPoint = this.junctionPoints.pop();
            if (removedJunctionPoint !== undefined) {
                this.renderer.removeChild(this.groupElement, removedJunctionPoint);
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
        this.nextPoint = ToolLineService.calculateNextPointPosition(
            this.lastPoint,
            Tool.mousePosition,
            this.isShiftDown,
            this.isCurrentlyDrawing
        );
    }

    private updatePreviewLinePosition(): void {
        if (this.isCurrentlyDrawing) {
            this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());
        }
    }
}
