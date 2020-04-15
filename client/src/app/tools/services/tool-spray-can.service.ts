import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
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
    private intervalId: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.SprayCan);
        this.settings.sprayDiameter = ToolDefaults.defaultSprayDiameter;
        this.settings.sprayRate = ToolDefaults.defaultSprayRate;
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.startSpraying();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopSpraying();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.stopSpraying();
    }

    onPrimaryColorChange(color: Color): void {
        if (this.group !== undefined) {
            this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
        }
    }

    onToolDeselection(): void {
        this.stopSpraying();
    }

    onFocusOut(): void {
        this.stopSpraying();
    }

    private startSpraying(): void {
        this.group = this.renderer.createElement('g', 'svg') as SVGGElement;
        this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
        this.drawingService.addElement(this.group);

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
        this.renderer.setAttribute(circle, 'cx', `${Tool.mousePosition.x + randomOffset.x}`);
        this.renderer.setAttribute(circle, 'cy', `${Tool.mousePosition.y + randomOffset.y}`);
        const pointRadius = 1;
        this.renderer.setAttribute(circle, 'r', pointRadius.toString());
        return circle;
    }

    private stopSpraying(): void {
        if (this.group === undefined) {
            return;
        }
        window.clearInterval(this.intervalId);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group));
        this.group = undefined;
    }
}
