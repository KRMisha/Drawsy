import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSprayCanService extends Tool {
    private group?: SVGGElement;
    private mousePosition: Vec2;
    private intervalId: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.SprayCan);
        this.settings.sprayDiameter = ToolDefaults.defaultSprayDiameter;
        this.settings.sprayRate = ToolDefaults.defaultSprayRate;
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing || event.button !== MouseButton.Left) {
            return;
        }

        this.mousePosition = this.getMousePosition(event);
        this.startSpraying();
    }

    onMouseUp(event: MouseEvent): void {
        this.stopSpraying();
    }

    onLeave(event: MouseEvent): void {
        this.stopSpraying();
    }

    onPrimaryColorChange(color: Color): void {
        this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
    }

    onToolDeselection(): void {
        this.stopSpraying();
    }

    private startSpraying(): void {
        this.group = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.group, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.drawingService.addElement(this.group as SVGElement);

        const oneSecondInMilliseconds = 1000;
        this.intervalId = window.setInterval(() => {
            this.createSpray();
        }, oneSecondInMilliseconds / this.settings.sprayRate!); // tslint:disable-line: no-non-null-assertion
    }

    private createSpray(): void {
        const density = this.settings.sprayDiameter! / 2; // tslint:disable-line: no-non-null-assertion
        for (let i = 0; i < density; i++) {
            this.createRandomPoint();
        }
    }

    private createRandomPoint(): void {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (this.settings.sprayDiameter! / 2); // tslint:disable-line: no-non-null-assertion
        const position: Vec2 = { x: Math.floor(radius * Math.cos(angle)), y: Math.floor(radius * Math.sin(angle)) };
        this.renderer.appendChild(this.group, this.createCircle(position));
    }

    private createCircle(randomOffset: Vec2): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(circle, 'cx', `${this.mousePosition.x + randomOffset.x}`);
        this.renderer.setAttribute(circle, 'cy', `${this.mousePosition.y + randomOffset.y}`);
        const pointRadius = 1;
        this.renderer.setAttribute(circle, 'r', pointRadius.toString());
        return circle;
    }

    private stopSpraying(): void {
        if (this.group === undefined) {
            return;
        }

        window.clearInterval(this.intervalId);
        this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.group));
        this.group = undefined;
    }
}
