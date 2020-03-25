import { Injectable, RendererFactory2 } from '@angular/core';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEyedropperService extends Tool {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        private svgUtilityService: SvgUtilityService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Eyedropper);
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing) {
            this.setColor(event);
        }
    }

    private async getPixelColor(pixel: Vec2): Promise<Color> {
        const greenIndexOffset = 1;
        const blueIndexOffset = 2;
        const alphaIndexOffset = 3;
        const valuesPerColorCount = 4;
        pixel.x = Math.round(pixel.x);
        pixel.y = Math.round(pixel.y);

        const canvas = await this.svgUtilityService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
        const colorIndex = pixel.y * (canvas.width * valuesPerColorCount) + pixel.x * valuesPerColorCount;
        const red = data[colorIndex];
        const green = data[colorIndex + greenIndexOffset];
        const blue = data[colorIndex + blueIndexOffset];
        const alpha = data[colorIndex + alphaIndexOffset];
        return Color.fromRgba(red, green, blue, alpha);
    }

    private async setColor(event: MouseEvent): Promise<void> {
        const color = await this.getPixelColor(this.getMousePosition(event));
        if (event.button === MouseButton.Left) {
            this.colorService.setPrimaryColor(color);
        } else if (event.button === MouseButton.Right) {
            this.colorService.setSecondaryColor(color);
        }
    }
}
