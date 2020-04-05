import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEyedropperService extends Tool {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private rasterizationService: RasterizationService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Eyedropper);
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && (event.button === MouseButton.Left || event.button === MouseButton.Right)) {
            this.updateColorServiceColor(event.button);
        }
    }

    private async updateColorServiceColor(mouseButton: MouseButton): Promise<void> {
        const colorUnderCursor = await this.getPixelColor({ x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) });
        mouseButton === MouseButton.Left
            ? (this.colorService.primaryColor = colorUnderCursor)
            : (this.colorService.secondaryColor = colorUnderCursor);
    }

    private async getPixelColor(pixelPosition: Vec2): Promise<Color> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;

        const colorValuesCount = 4;
        const colorIndex = pixelPosition.y * (canvas.width * colorValuesCount) + pixelPosition.x * colorValuesCount;

        const rgbaComponents: number[] = [];
        for (let i = 0; i < colorValuesCount; i++) {
            rgbaComponents.push(data[colorIndex + i]);
        }
        const [red, green, blue, alpha] = rgbaComponents;
        return Color.fromRgba(red, green, blue, alpha / Color.maxRgb);
    }
}
