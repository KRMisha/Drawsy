import { ColorService } from 'src/app/drawing/services/color.service';
import { DrawingService } from '../../../../drawing/services/drawing.service';
import { Tool, ToolSetting } from '../../tool';

const defaultSize = 5;

export abstract class ToolBrush extends Tool {
    private path: SVGPathElement;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Size, defaultSize);
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

    protected createNewPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(path, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        return path;
    }

    private getPathStartString(x: number, y: number): string {
        return 'M' + x.toString() + ' ' + y.toString() + ' ' + 'L' + x.toString() + ' ' + y.toString() + ' ';
    }

    private getPathLineString(x: number, y: number): string {
        return 'L' + x.toString() + ' ' + y.toString() + ' ';
    }
}
