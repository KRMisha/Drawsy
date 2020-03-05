import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolNames } from '../enums/tool-names.enum';
import { Tool } from './tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEyedropperService extends Tool {
    constructor(protected drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService, ToolNames.Eyedropper);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.getPixelColor(this.getMousePosition(event)).then((color: Color) => {
                if (event.button === ButtonId.Left) {
                    this.colorService.setPrimaryColor(color);
                } else if (event.button === ButtonId.Right) {
                    this.colorService.setSecondaryColor(color);
                }
            });
        }
    }

    private async getPixelColor(pixel: Vec2): Promise<Color> {
        const greenIndexOffset = 1;
        const blueIndexOffset = 2;
        const alphaIndexOffset = 3;
        const valuesPerColorCount = 4;

        return new Promise<Color>((resolve: (color: Color) => void) => {
            this.drawingService.getCanvasFromSvgRoot(this.drawingService.drawingRoot).then((canvas: HTMLCanvasElement) => {
                const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                const data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
                const colorIndex = pixel.y * (canvas.width * valuesPerColorCount) + pixel.x * valuesPerColorCount;
                const red = data[colorIndex];
                const green = data[colorIndex + greenIndexOffset];
                const blue = data[colorIndex + blueIndexOffset];
                const alpha = data[colorIndex + alphaIndexOffset];
                resolve(Color.fromRgba(red, green, blue, alpha));
            });
        });
    }
}
