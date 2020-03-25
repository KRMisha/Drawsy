import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSprayCanService extends Tool {
    private groupElement?: SVGGElement;
    private mousePosition: Vec2;
    private interval: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.SprayCan);
        this.toolSettings.set(ToolSetting.SprayDiameter, ToolDefaults.defaultSprayDiameter);
        this.toolSettings.set(ToolSetting.SprayRate, ToolDefaults.defaultSprayRate);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing || event.button !== MouseButton.Left) {
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
        const density = (this.toolSettings.get(ToolSetting.SprayDiameter) as number) / 2;
        for (let i = 0; i < density; i++) {
            this.createRandomPoint();
        }
    }

    private createRandomPoint(): void {
        const angle = Math.random() * 2 * Math.PI;

        const radius = (Math.random() * (this.toolSettings.get(ToolSetting.SprayDiameter) as number)) / 2;
        const position: Vec2 = { x: Math.floor(radius * Math.cos(angle)), y: Math.floor(radius * Math.sin(angle)) };
        this.renderer.appendChild(this.groupElement, this.createCircle(position));
    }

    private createSprayInterval(): void {
        const oneSecondInMilliseconds = 1000;
        this.interval = window.setInterval(() => {
            this.createSpray();
        }, oneSecondInMilliseconds / (this.toolSettings.get(ToolSetting.SprayRate) as number));
    }
}
