import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import ToolDefaults from '@app/tools/enums/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
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
    constructor(drawingService: DrawingService, colorService: ColorService, commandService: CommandService) {
        super(drawingService, colorService, commandService, ToolName.SprayCan);
        this.toolSettings.set(ToolSetting.SprayRadius, ToolDefaults.defaultSprayRadius);
        this.toolSettings.set(ToolSetting.SpraySpeed, ToolDefaults.defaultSpraySpeed);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (Tool.isMouseDown && Tool.isMouseInside && this.groupElement) {
            window.clearInterval(this.interval);
            this.createSpray();
            this.createSprayInterval();
        } else {
            this.stopSpray();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInside || event.button !== ButtonId.Left) {
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

    onPrimaryColorChange(color: Color): void {
        this.renderer.setAttribute(this.groupElement, 'fill', color.toRgbaString());
    }

    private stopSpray(): void {
        if (this.groupElement === undefined) {
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
