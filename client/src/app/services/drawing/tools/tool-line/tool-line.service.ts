import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

@Injectable({
    providedIn: 'root'
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

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Color, new Color(0, 0, 0, 1));
        this.toolSettings.set(ToolSetting.Size, 1);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.calculatePointPosition();
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
        }

        const polylineString = this.polyline.getAttribute('points') + ' ' + this.nextPointX + ' ' + this.nextPointY;
        this.renderer.setAttribute(this.polyline, 'points', polylineString);

        this.calculatePointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.calculatePointPosition();
        this.updatePreviewLinePosition();
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.stopDrawing();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            this.stopDrawing();
        } else if (event.code === 'ShiftLeft') {
            this.isShiftDown = true;
            this.calculatePointPosition();
            this.updatePreviewLinePosition();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.code === 'ShiftLeft') {
            this.isShiftDown = false;
            this.calculatePointPosition();
            this.updatePreviewLinePosition();
        }
    }

    private calculatePointPosition() {
        if (this.currentlyDrawing === false || this.isShiftDown === false) {
            this.nextPointX = this.mouseX;
            this.nextPointY = this.mouseY;
        } else if (this.isShiftDown === true) {
            let angle = Math.atan2((this.mouseY - this.lastPointY), (this.mouseX - this.lastPointX)) * 180 / Math.PI;
            angle = Math.round(angle / 45) * 45;
            if (angle <= 0) {
                angle += 360;
            }

            if (angle === 0 || angle === 180 || angle === 360) {
                this.nextPointX = this.mouseX;
                this.nextPointY = this.lastPointY;
            } else if (angle === 90 || angle === 270) {
                this.nextPointX = this.lastPointX;
                this.nextPointY = this.mouseY;
            } else {
                this.nextPointX = this.mouseX;
                this.nextPointY = Math.tan((angle / 180) * Math.PI) * (this.mouseX - this.lastPointX) + this.lastPointY;
            }
        }
    }

    private stopDrawing(): void {
        this.currentlyDrawing = false;
        this.renderer.setAttribute(this.previewLine, 'display', 'none');
    }

    private createNewPolyline(): SVGPolylineElement {
        const polyline = this.renderer.createElement('polyline', 'svg');
        this.renderer.setAttribute(polyline, 'stroke', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(polyline, 'fill', 'none');
        this.renderer.setAttribute(polyline, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(polyline, 'stroke-linecap', 'round');
        this.renderer.setAttribute(polyline, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(polyline, 'points', '');
        return polyline;
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
        this.renderer.setAttribute(this.previewLine, 'stroke-linejoin', this.polyline.getAttribute('strstroke-linejoinoke') as string);
    }
}
