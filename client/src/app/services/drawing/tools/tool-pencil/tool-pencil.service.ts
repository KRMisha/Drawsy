import { Injectable } from '@angular/core';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSettings } from '../tool';

@Injectable({
    providedIn: 'root',
})
export class ToolPencilService extends Tool {
    private path: SVGPathElement;
    private pathString: string;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.toolSettings.set(ToolSettings.Color, new Color(0, 0, 0));
        this.toolSettings.set(ToolSettings.Size, 1);
    }

    private getPathStartString(x: number, y: number): string {
        return 'M' + String(x) + ' ' + String(y) + ' ' + 'L' + String(x) + ' ' + String(y) + ' ';
    }

    private getPathLineString(x: number, y: number): string {
        return 'L' + String(x) + ' ' + String(y) + ' ';
    }

    onMouseDown(event: MouseEvent) {
        this.path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(this.path, 'stroke', 'black');
        this.renderer.setAttribute(this.path, 'fill', 'none');
        this.renderer.setAttribute(this.path, 'stroke-width', '5');
        this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');

        this.pathString = this.getPathStartString(event.offsetX, event.clientY);
        this.renderer.setAttribute(this.path, 'd', this.pathString);
        this.drawingService.addElement(this.path);
    }

    onClick(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.pathString += this.getPathLineString(event.clientX - event.offsetX, event.clientY);
            this.renderer.setAttribute(this.path, 'd', this.pathString);
            this.drawingService.addElement(this.path);
        }
    }

    onLeave(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.pathString += this.getPathLineString(event.clientX - event.offsetX, event.clientY);
            this.renderer.setAttribute(this.path, 'd', this.pathString);
            this.drawingService.addElement(this.path);
        }
    }
}
