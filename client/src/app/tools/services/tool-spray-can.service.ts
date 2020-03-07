import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { defaultDensity, defaultSize } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from './tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSprayCanService extends Tool {
    private spraySize = defaultSize;
    private sprayDensity = defaultDensity;
    private groupElement: SVGGElement;
    private mousePosition: Vec2;

    constructor(protected drawingService: DrawingService, private colorService: ColorService, private commandService: CommandService) {
        super(drawingService, ToolNames.SprayCan);
        this.toolSettings.set(ToolSetting.Size, defaultSize);
        this.toolSettings.set(ToolSetting.Density, defaultDensity);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown && this.isMouseInside) {
            for (let i = 0; i < this.sprayDensity; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * this.spraySize;
                this.mousePosition = this.getMousePosition(event);
                const position: Vec2 = { x: Math.floor(radius * Math.cos(angle)), y: Math.floor(radius * Math.sin(angle)) };
                console.log(this.createCircle(position));
                // this.renderer.appendChild(this.groupElement, this.createCircle(position));
            }
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside && event.button === ButtonId.Left) {
            return;
        }

        if (!this.isMouseDown) {
            this.isMouseDown = true;
            this.startSpray();
        }

        this.mousePosition = this.getMousePosition(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.isMouseDown) {
            return;
        }

        this.isMouseDown = false;
        this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.groupElement));
    }

    private startSpray(): void {
        this.groupElement = this.renderer.createElement('g', 'svg');
    }

    private createCircle(position: Vec2): SVGCircleElement {
        const newCircle: SVGCircleElement = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(newCircle, 'cx', (this.mousePosition.x + position.x).toString());
        this.renderer.setAttribute(newCircle, 'cy', (this.mousePosition.y + position.y).toString());
        this.renderer.setAttribute(newCircle, 'r', '1');
        this.renderer.setAttribute(newCircle, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        return newCircle;
    }
}
