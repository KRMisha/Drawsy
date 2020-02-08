import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

@Injectable({
    providedIn: 'root',
})
export class ToolBrushService extends Tool {
    private path: SVGPathElement;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Size, 1);
        this.toolSettings.set(ToolSetting.Texture, 1);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseInside && this.isMouseDown) {
            const pathString = this.path.getAttribute('d') + this.getPathLineString(event.offsetX, event.offsetY);
            this.renderer.setAttribute(this.path, 'd', pathString);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.path = this.createNewPath();

            const pathString = this.getPathStartString(event.offsetX, event.offsetY);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.drawingService.addElement(this.path);
        }
    }

    onEnter(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onLeave(event: MouseEvent): void {
        if (this.isMouseDown) {
            const pathString = this.path.getAttribute('d') + this.getPathLineString(event.offsetX, event.offsetY);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.isMouseDown = false;
        }
    }

    private getPathStartString(x: number, y: number): string {
        return 'M' + String(x) + ' ' + String(y) + ' ' + 'L' + String(x) + ' ' + String(y) + ' ';
    }

    private getPathLineString(x: number, y: number): string {
        return 'L' + String(x) + ' ' + String(y) + ' ';
    }

    private createNewPath(): SVGPathElement {
        console.log(this.toolSettings.get(ToolSetting.Texture));
        const path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'stroke', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'filter', "url(#texture" + this.toolSettings.get(ToolSetting.Texture) + ")");
        return path;
    }
}
