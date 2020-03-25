import { Injectable, RendererFactory2 } from '@angular/core';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { AppendElementCommand } from '@app/shared/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { Tool } from '@app/tools/services/tool';

const minimumPointsToEnableBackspace = 4;
const geometryDimension = 2;
const lineClosingPixelTolerance = 3;

@Injectable({
    providedIn: 'root',
})
export class ToolLineService extends Tool {
    private groupElement: SVGGElement;
    private polyline: SVGPolylineElement;
    private previewLine: SVGLineElement;
    private isCurrentlyDrawing = false;
    private mousePosition: Vec2;
    private nextPoint: Vec2;
    private lastPoint: Vec2;
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
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Line);
        this.toolSettings.set(ToolSetting.LineWidth, ToolDefaults.defaultLineWidth);
        this.toolSettings.set(ToolSetting.JunctionSettings, ToolDefaults.defaultJunctionSettings);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing) {
            return;
        }

        this.mousePosition = this.getMousePosition(event);
        this.updateNextPointPosition();
        this.lastPoint = this.nextPoint;

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

        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.junctionPoints.length > 0) {
            this.renderer.removeChild(this.groupElement, this.junctionPoints.pop() as SVGCircleElement);
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
                    this.renderer.removeChild(this.groupElement, this.junctionPoints.pop() as SVGCircleElement);
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

        const previewColor = Color.fromColor(this.colorService.getPrimaryColor());
        previewColor.alpha /= 2;
        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());

        for (const junction of this.junctionPoints) {
            this.renderer.setAttribute(junction, 'fill', color.toRgbaString());
        }
    }

    onToolDeselection(): void {
        if (this.isCurrentlyDrawing) {
            this.stopDrawing();
        }
    }

    private startDrawingShape(): void {
        this.isCurrentlyDrawing = true;

        ({ isEnabled: this.isJunctionEnabled, diameter: this.junctionDiameter } = this.toolSettings.get(
            ToolSetting.JunctionSettings
        ) as JunctionSettings);

        const junctionDiameterActualValue = this.isJunctionEnabled ? this.junctionDiameter : 0;
        const padding = Math.max(0, (this.toolSettings.get(ToolSetting.LineWidth) as number) / 2 - junctionDiameterActualValue);

        this.groupElement = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.groupElement, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(this.groupElement, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(this.groupElement, 'stroke-width', (this.toolSettings.get(ToolSetting.LineWidth) as number).toString());
        this.renderer.setAttribute(this.groupElement, 'data-padding', padding.toString());

        this.drawingService.addElement(this.groupElement);

        this.polyline = this.createNewPolyline();
        this.renderer.appendChild(this.groupElement, this.polyline);

        this.previewLine = this.renderer.createElement('line', 'svg');
        this.drawingService.addUiElement(this.previewLine);
        this.updatePreviewLine();
    }

    private removeLastPointFromLine(): void {
        if (this.points.length >= minimumPointsToEnableBackspace) {
            this.points.length = this.points.length - geometryDimension;
            this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
            this.lastPoint.x = this.points[this.points.length - geometryDimension];
            this.lastPoint.y = this.points[this.points.length - 1];
            this.renderer.setAttribute(this.previewLine, 'x1', this.lastPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y1', this.lastPoint.y.toString());

            this.renderer.removeChild(this.groupElement, this.junctionPoints.pop() as SVGCircleElement);
        }
    }

    private updateNextPointPosition(): void {
        this.nextPoint = this.calculateNextPointPosition(this.lastPoint, this.mousePosition, this.isShiftDown, this.isCurrentlyDrawing);
    }

    private calculateNextPointPosition(lastPoint: Vec2, mousePosition: Vec2, isShiftDown: boolean, isCurrentlyDrawing: boolean): Vec2 {
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

    private stopDrawing(): void {
        this.isCurrentlyDrawing = false;
        this.points.length = 0;
        this.drawingService.removeUiElement(this.previewLine);
        this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.groupElement));
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
        this.renderer.setAttribute(circle, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(circle, 'stroke', 'none');
        this.junctionPoints.push(circle);
        return circle;
    }

    private updatePreviewLinePosition(): void {
        if (this.isCurrentlyDrawing) {
            this.renderer.setAttribute(this.previewLine, 'x2', this.nextPoint.x.toString());
            this.renderer.setAttribute(this.previewLine, 'y2', this.nextPoint.y.toString());
        }
    }

    private updatePreviewLine(): void {
        const previewColor = Color.fromColor(this.colorService.getPrimaryColor());
        previewColor.alpha /= 2;

        this.renderer.setAttribute(this.previewLine, 'stroke', previewColor.toRgbaString());
        this.renderer.setAttribute(this.previewLine, 'fill', this.polyline.getAttribute('fill') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-width', this.groupElement.getAttribute('stroke-width') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linecap', this.polyline.getAttribute('stroke-linecap') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', this.polyline.getAttribute('stroke-linejoin') as string);
    }
}
