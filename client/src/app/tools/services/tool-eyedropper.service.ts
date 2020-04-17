import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
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
        this.drawingService.hideUiElements();
        const drawingRootCopy = this.drawingService.drawingRoot.cloneNode(true) as SVGSVGElement;
        this.drawingService.showUiElements();

        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(drawingRootCopy);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        const colorUnderCursor = await this.rasterizationService.getPixelColor(data, canvas.width, {
            x: Math.round(Tool.mousePosition.x),
            y: Math.round(Tool.mousePosition.y),
        });

        mouseButton === MouseButton.Left
            ? (this.colorService.primaryColor = colorUnderCursor)
            : (this.colorService.secondaryColor = colorUnderCursor);
    }
}
