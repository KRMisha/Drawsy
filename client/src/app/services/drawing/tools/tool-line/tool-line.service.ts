import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

const minimumPointsToEnableBackspace = 4;
const geometryDimension = 2;
const lineClosingTolerance = 3;

@Injectable({
    providedIn: 'root',
})
export class ToolLineService extends Tool {
    private polyline: SVGPolylineElement;
    private previewLine: SVGLineElement;
    private currentlyDrawing = false;
    private mouseX: number;
    private mouseY: number;
    private nextPointX: number;
    private nextPointY: number;
    private lastPointX: number;
    private lastPointY: number;
    private isShiftDown = false;

    private points: number[] = [];
    private junctionPoints: SVGCircleElement[] = [];

    private hasJunction: boolean;
    private junctionSize: number;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Size, 5);
        this.toolSettings.set(ToolSetting.HasJunction, [false, 10]);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.updateNextPointPosition();
        this.lastPointX = this.nextPointX;
        this.lastPointY = this.nextPointY;

        if (this.previewLine === undefined) {
            this.previewLine = this.renderer.createElement('line', 'svg');
            this.renderer.setAttribute(this.previewLine, 'display', 'none');
            this.drawingService.addElement(this.previewLine);
        }

        this.renderer.setAttribute(this.previewLine, 'x1', '' + this.nextPointX);
        this.renderer.setAttribute(this.previewLine, 'y1', '' + this.nextPointY);
        this.renderer.setAttribute(this.previewLine, 'x2', '' + this.nextPointX);
        this.renderer.setAttribute(this.previewLine, 'y2', '' + this.nextPointY);

        if (this.currentlyDrawing === false) {
            this.polyline = this.createNewPolyline();
            this.updatePreviewLine();
            this.renderer.setAttribute(this.previewLine, 'display', '');
            this.currentlyDrawing = true;
            this.drawingService.addElement(this.polyline);
            this.drawingService.removeElement(this.previewLine);
            this.drawingService.addElement(this.previewLine);
        }

        this.points.push(this.nextPointX);
        this.points.push(this.nextPointY);
        this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));

        if (this.hasJunction) {
            const circle = this.createNewJunction();
            this.renderer.setAttribute(circle, 'cx', '' + this.nextPointX);
            this.renderer.setAttribute(circle, 'cy', '' + this.nextPointY);
            this.drawingService.addElement(circle);
        }

        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.updateNextPointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.junctionPoints.length > 0) {
            this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
        }
        this.points.length -= geometryDimension;

        if (this.isShiftDown === false) {
            const firstXIndex = 0;
            const firstYIndex = 1;
            const lastXIndex =  this.points.length - 2;
            const lastYIndex = this.points.length - 1;

            const deltaX = Math.abs(this.points[firstXIndex] - this.points[lastXIndex]);
            const deltaY = Math.abs(this.points[firstYIndex] - this.points[lastYIndex]);

            if (deltaX <= lineClosingTolerance && deltaY <= lineClosingTolerance) {
                if (this.junctionPoints.length > 0) {
                    this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
                }
                this.points[lastXIndex] = this.points[firstXIndex];
                this.points[lastYIndex] = this.points[firstYIndex];
                this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
            }
        }
        this.junctionPoints.length = 0;
        this.stopDrawing();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            this.stopDrawing();
            this.drawingService.removeElement(this.polyline);
            for (const circle of this.junctionPoints) {
                this.drawingService.removeElement(circle);
            }
            this.junctionPoints.length = 0;
        } else if (event.code === 'ShiftLeft') {
            this.isShiftDown = true;
            this.updateNextPointPosition();
            this.updatePreviewLinePosition();
        } else if (event.code === 'Backspace') {
            this.removeLastPointFromLine();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.code === 'ShiftLeft') {
            this.isShiftDown = false;
            this.updateNextPointPosition();
            this.updatePreviewLinePosition();
        }
    }

    private removeLastPointFromLine(): void {
        if (this.points.length >= minimumPointsToEnableBackspace) {
            this.points.length = this.points.length - geometryDimension;
            this.renderer.setAttribute(this.polyline, 'points', this.points.join(' '));
            this.lastPointX = this.points[this.points.length - geometryDimension];
            this.lastPointY = this.points[this.points.length - 1];
            this.renderer.setAttribute(this.previewLine, 'x1', '' + this.lastPointX);
            this.renderer.setAttribute(this.previewLine, 'y1', '' + this.lastPointY);

            this.drawingService.removeElement(this.junctionPoints.pop() as SVGCircleElement);
        }
    }

    private updateNextPointPosition() {
        const xy = this.calculateNextPointPosition(this.lastPointX,
                                                   this.lastPointY,
                                                   this.mouseX,
                                                   this.mouseY,
                                                   this.isShiftDown,
                                                   this.currentlyDrawing);
        this.nextPointX = xy[0];
        this.nextPointY = xy[1];
    }

    private calculateNextPointPosition(lastX: number, lastY: number,
                                       currentX: number, currentY: number,
                                       isShiftDown: boolean, currentlyDrawing: boolean): [number, number] {
        let nextPointX: number;
        let nextPointY: number;
        if (currentlyDrawing === false || isShiftDown === false) {
            nextPointX = currentX
            nextPointY = currentY;
        } else {
            let angle = Math.atan2((currentY - lastY), (currentX - lastX)) * 180 / Math.PI;
            angle = Math.round(angle / 45) * 45;
            if (angle <= 0) {
                angle += 360;
            }

            if (angle === 0 || angle === 180 || angle === 360) {
                nextPointX = currentX;
                nextPointY = lastY;
            } else if (angle === 90 || angle === 270) {
                nextPointX = lastX;
                nextPointY = currentY;
            } else {
                nextPointX = currentX;
                nextPointY = Math.tan((angle / 180) * Math.PI) * (currentX - lastX) + lastY;
            }
        }
        return [nextPointX, nextPointY]
    }

    private stopDrawing(): void {
        this.currentlyDrawing = false;
        this.renderer.setAttribute(this.previewLine, 'display', 'none');
        this.points.length = 0;
    }

    private createNewPolyline(): SVGPolylineElement {
        const polyline = this.renderer.createElement('polyline', 'svg');
        this.renderer.setAttribute(polyline, 'stroke', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(polyline, 'fill', 'none');
        this.renderer.setAttribute(polyline, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(polyline, 'stroke-linecap', 'round');
        this.renderer.setAttribute(polyline, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(polyline, 'points', '');

        const junction = this.toolSettings.get(ToolSetting.HasJunction) as [boolean, number];
        this.hasJunction = junction[0];
        this.junctionSize = junction[1];
        return polyline;
    }

    private createNewJunction(): SVGCircleElement {
        console.log(this.polyline.getAttribute('fill'))
        const circle = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(circle, 'r', '' + this.junctionSize);
        this.renderer.setAttribute(circle, 'fill', this.polyline.getAttribute('stroke') as string);
        this.junctionPoints.push(circle);
        return circle;
    }

    private updatePreviewLinePosition(): void {
        if (this.currentlyDrawing) {
            this.renderer.setAttribute(this.previewLine, 'x2', '' + this.nextPointX);
            this.renderer.setAttribute(this.previewLine, 'y2', '' + this.nextPointY);
        }
    }

    private updatePreviewLine(): void {
        const rgba = this.colorService.getPrimaryColor().getRgba();
        const previewColor = new Color(rgba[0], rgba[1], rgba[2], rgba[3] / 2);
        this.renderer.setAttribute(this.previewLine, 'stroke', `${previewColor.toRgbaString()}`);
        this.renderer.setAttribute(this.previewLine, 'fill', this.polyline.getAttribute('fill') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-width', this.polyline.getAttribute('stroke-width') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linecap', this.polyline.getAttribute('stroke-linecap') as string);
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', this.polyline.getAttribute('stroke-linejoin') as string);
    }
}
