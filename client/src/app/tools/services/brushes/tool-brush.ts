import { RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolData } from '@app/tools/classes/tool-data';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolBrush extends Tool {
    private path?: SVGPathElement;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        toolInfo: ToolData
    ) {
        super(rendererFactory, drawingService, colorService, commandService, toolInfo);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
    }

    onMouseMove(): void {
        if (Tool.isLeftMouseButtonDown && Tool.isMouseInsideDrawing) {
            this.updatePath();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.path = this.createPath();
            this.updatePath();
            this.drawingService.addElement(this.path);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopDrawing();
        }
    }

    onLeave(event: MouseEvent): void {
        if (Tool.isLeftMouseButtonDown) {
            this.updatePath();
            this.stopDrawing();
        }
    }

    onPrimaryColorChange(color: Color): void {
        if (this.path !== undefined) {
            this.renderer.setAttribute(this.path, 'stroke', color.toRgbaString());
        }
    }

    protected createPath(): SVGPathElement {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');

        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor.toRgbaString());
        // tslint:disable: no-non-null-assertion
        this.renderer.setAttribute(path, 'data-padding', `${this.settings.lineWidth! / 2}`);
        this.renderer.setAttribute(path, 'stroke-width', this.settings.lineWidth!.toString());
        // tslint:enable: no-non-null-assertion
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'd', `M${Tool.mousePosition.x} ${Tool.mousePosition.y}`);

        return path;
    }

    private updatePath(): void {
        if (this.path === undefined) {
            return;
        }

        const pathString = this.path.getAttribute('d') + ` L${Tool.mousePosition.x} ${Tool.mousePosition.y}`;
        this.renderer.setAttribute(this.path, 'd', pathString);
    }

    private stopDrawing(): void {
        if (this.path === undefined) {
            return;
        }

        this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.path));
        this.path = undefined;
    }
}
