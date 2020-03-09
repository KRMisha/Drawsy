import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { defaultSprayRadius, defaultSpraySpeed } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from './tool';

const oneSecondInMilliseconds = 1000;

@Injectable({
    providedIn: 'root',
})
export class ToolSprayCanService extends Tool {
    private groupElement?: SVGGElement;
    private mousePosition: Vec2;
    private interval: number;
    constructor(protected drawingService: DrawingService, private colorService: ColorService, private commandService: CommandService) {
        super(drawingService, ToolNames.SprayCan);
        this.toolSettings.set(ToolSetting.SprayRadius, defaultSprayRadius);
        this.toolSettings.set(ToolSetting.SpraySpeed, defaultSpraySpeed);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (this.isMouseDown && this.isMouseInside && this.groupElement) {
            window.clearInterval(this.interval);
            this.createSpray();
            this.createSprayInterval();
        } else {
            this.stopSpray();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.isMouseInside && event.button !== ButtonId.Left) {
            return;
        }

        this.groupElement = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.groupElement, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(this.groupElement, 'stroke', 'none');

        this.mousePosition = this.getMousePosition(event);
        this.drawingService.addElement(this.groupElement as SVGElement);
        this.createSprayInterval();
    }

    onMouseUp(event: MouseEvent): void {
        this.stopSpray();
    }

    private stopSpray(): void {
        if (!this.groupElement) {
            return;
        }
        window.clearInterval(this.interval);
        this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.groupElement));
        this.groupElement = undefined;
    }

    private createCircle(randomOffset: Vec2): SVGCircleElement {
        const newCircle: SVGCircleElement = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(newCircle, 'cx', (this.mousePosition.x + randomOffset.x).toString());
        this.renderer.setAttribute(newCircle, 'cy', (this.mousePosition.y + randomOffset.y).toString());
        this.renderer.setAttribute(newCircle, 'r', '1');
        return newCircle;
    }

    private createSpray(): void {
        const density = this.toolSettings.get(ToolSetting.SprayRadius) as number;
        for (let i = 0; i < density; i++) {
            this.createRandomPoint();
        }
    }

    private createRandomPoint(): void {
        const angle = Math.random() * 2 * Math.PI;

        const radius = Math.random() * (this.toolSettings.get(ToolSetting.SprayRadius) as number);
        const position: Vec2 = { x: Math.floor(radius * Math.cos(angle)), y: Math.floor(radius * Math.sin(angle)) };
        this.renderer.appendChild(this.groupElement, this.createCircle(position));
    }

    private createSprayInterval(): void {
        this.interval = window.setInterval(() => {
            this.createSpray();
        }, oneSecondInMilliseconds / (this.toolSettings.get(ToolSetting.SpraySpeed) as number));
    }
}
