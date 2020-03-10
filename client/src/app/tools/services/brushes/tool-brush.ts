import { Color } from '@app/classes/color';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { defaultSize } from '@app/tools/enums/tool-defaults.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolBrush extends Tool {
    private path?: SVGPathElement;

    constructor(
        protected drawingService: DrawingService,
        private colorService: ColorService,
        protected commandService: CommandService,
        name: ToolName,
    ) {
        super(drawingService, name);
        this.toolSettings.set(ToolSetting.Size, defaultSize);
    }

    onMouseMove(event: MouseEvent): void {
        if (Tool.isMouseDown && Tool.isMouseInside) {
            const mousePosition = this.getMousePosition(event);
            const pathString = (this.path as SVGElement).getAttribute('d') + this.getPathLineString(mousePosition.x, mousePosition.y);
            this.renderer.setAttribute(this.path, 'd', pathString);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInside && event.button === ButtonId.Left) {
            this.path = this.createNewPath();

            const mousePosition = this.getMousePosition(event);
            const pathString = this.getPathStartString(mousePosition.x, mousePosition.y);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.drawingService.addElement(this.path);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === ButtonId.Left) {
            this.stopDrawing();
        }
    }

    onEnter(event: MouseEvent): void {
        this.stopDrawing();
    }

    onLeave(event: MouseEvent): void {
        if (Tool.isMouseDown) {
            const pathString = (this.path as SVGElement).getAttribute('d') + this.getPathLineString(event.offsetX, event.offsetY);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.stopDrawing();
        }
    }

    onPrimaryColorChange(color: Color): void {
        if (!Tool.isMouseInside || !Tool.isMouseDown) {
            return;
        }
        this.renderer.setAttribute(this.path, 'stroke', color.toRgbaString());
    }

    protected createNewPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(path, 'shape-padding', ((this.toolSettings.get(ToolSetting.Size) as number) / 2).toString());
        this.renderer.setAttribute(path, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        return path;
    }

    private getPathStartString(x: number, y: number): string {
        return `M${x.toString()}  ${y.toString()} L${x.toString()} ${y.toString()}`;
    }

    private getPathLineString(x: number, y: number): string {
        return `L${x.toString()} ${y.toString()}`;
    }

    private stopDrawing(): void {
        Tool.isMouseDown = false;
        if (this.path !== undefined) {
            this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.path));
            this.path = undefined;
        }
    }
}
