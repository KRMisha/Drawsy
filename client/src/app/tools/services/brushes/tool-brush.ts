import { RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ToolIcon } from '@app/tools/enums/tool-icon.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolBrush extends Tool {
    private path?: SVGPathElement;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        name: ToolName,
        icon: ToolIcon
    ) {
        super(rendererFactory, drawingService, colorService, commandService, name, icon);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
    }

    onMouseMove(event: MouseEvent): void {
        if (Tool.isLeftMouseButtonDown && Tool.isMouseInsideDrawing) {
            const mousePosition = this.getMousePosition(event);
            const pathString = (this.path as SVGElement).getAttribute('d') + this.getPathLineString(mousePosition.x, mousePosition.y);
            this.renderer.setAttribute(this.path, 'd', pathString);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.path = this.createNewPath();
            const mousePosition = this.getMousePosition(event);
            const pathString = this.getPathStartString(mousePosition.x, mousePosition.y);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.drawingService.addElement(this.path);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopDrawing();
        }
    }

    onEnter(event: MouseEvent): void {
        this.stopDrawing();
    }

    onLeave(event: MouseEvent): void {
        if (Tool.isLeftMouseButtonDown) {
            const pathString = (this.path as SVGElement).getAttribute('d') + this.getPathLineString(event.offsetX, event.offsetY);
            this.renderer.setAttribute(this.path, 'd', pathString);
            this.stopDrawing();
        }
    }

    onPrimaryColorChange(color: Color): void {
        if (!Tool.isMouseInsideDrawing || !Tool.isLeftMouseButtonDown) {
            return;
        }
        this.renderer.setAttribute(this.path, 'stroke', color.toRgbaString());
    }

    protected createNewPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
        // tslint:disable: no-non-null-assertion
        this.renderer.setAttribute(path, 'data-padding', `${this.settings.lineWidth! / 2}`);
        this.renderer.setAttribute(path, 'stroke-width', this.settings.lineWidth!.toString());
        // tslint:enable: no-non-null-assertion
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        return path;
    }

    private getPathStartString(x: number, y: number): string {
        return `M${x}  ${y} L${x} ${y}`;
    }

    private getPathLineString(x: number, y: number): string {
        return `L${x} ${y}`;
    }

    private stopDrawing(): void {
        Tool.isLeftMouseButtonDown = false;
        if (this.path !== undefined) {
            this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.path));
            this.path = undefined;
        }
    }
}
