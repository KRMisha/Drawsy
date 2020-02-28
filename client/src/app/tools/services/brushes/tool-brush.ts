import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Tool, ToolSetting } from '@app/tools/services/tool';

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
            this.path.setAttribute('d', pathString);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.path = this.createNewPath();

            const pathString = this.getPathStartString(event.offsetX, event.offsetY);
            this.path.setAttribute('d', pathString);
            this.drawingService.addElement(this.path);
        }
    }

    onEnter(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onLeave(event: MouseEvent): void {
        if (this.isMouseDown) {
            const pathString = this.path.getAttribute('d') + this.getPathLineString(event.offsetX, event.offsetY);
            this.path.setAttribute('d', pathString);
            this.isMouseDown = false;
        }
    }

    protected createNewPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this.colorService.getPrimaryColor().toRgbaString());
        path.setAttribute('stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        return path;
    }

    private getPathStartString(x: number, y: number): string {
        return `M${x.toString()}  ${y.toString()} L${x.toString()} ${y.toString()}`;
    }

    private getPathLineString(x: number, y: number): string {
        return `L${x.toString()} ${y.toString()}`;
    }
}
