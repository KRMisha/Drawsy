import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../drawing.service';
import { Textures, Tool, ToolSetting } from '../tool';

@Injectable({
    providedIn: 'root',
})
export class ToolBrushService extends Tool {
    private path: SVGPathElement;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Size, 1);
        this.toolSettings.set(ToolSetting.Texture, Textures.Texture1);
        this.name = 'Pinceau';
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
        return 'M' + x.toString() + ' ' + y.toString + ' ' + 'L' + x.toString() + ' ' + y.toString() + ' ';
    }

    private getPathLineString(x: number, y: number): string {
        return 'L' + x.toString() + ' ' + y.toString() + ' ';
    }

    private createNewPath(): SVGPathElement {
        console.log(this.toolSettings.get(ToolSetting.Texture));
        const path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'stroke', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'filter', 'url(#texture' + this.toolSettings.get(ToolSetting.Texture) + ')');
        return path;
    }
}
