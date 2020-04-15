import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Queue } from '@app/shared/classes/queue';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolFillService extends Tool {
    private group?: SVGGElement;

    private data: Uint8ClampedArray;
    private canvasWidth: number;
    private selectedColor: Color;

    private pixelQueue: Queue<Vec2>;
    private visitedPixels: Set<string>;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private rasterizationService: RasterizationService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Fill);
        this.settings.fillDeviation = ToolDefaults.defaultFillDeviation;
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.group = this.renderer.createElement('g', 'svg') as SVGGElement;
            this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
            this.fillWithColor();
        }
    }

    private async fillWithColor(): Promise<void> {
        this.pixelQueue = new Queue<Vec2>();
        this.visitedPixels = new Set<string>();

        await this.initializeCanvas();
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.selectedColor = this.rasterizationService.getPixelColor(this.data, this.canvasWidth, startPixel);
        this.breadthFirstSearch(startPixel);

        // this.group will not be undefined if this method is called (defined in onMouseDown)
        // tslint:disable: no-non-null-assertion
        this.drawingService.addElement(this.group!);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group!));
        // tslint:enable: no-non-null-assertion

        delete this.pixelQueue;
        delete this.visitedPixels;
    }

    private async initializeCanvas(): Promise<void> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
        this.canvasWidth = canvas.width;
    }

    private breadthFirstSearch(startPixel: Vec2): void {
        this.pixelQueue.enqueue(startPixel);

        while (!this.pixelQueue.isEmpty()) {
            // The pixel will always be defined since it can only be added to the queue if it is valid
            const pixel = this.pixelQueue.dequeue()!; // tslint:disable-line: no-non-null-assertion
            this.addRectangleOnPixel(pixel);

            const adjacentPixels: Vec2[] = [
                { x: pixel.x, y: pixel.y - 1 },
                { x: pixel.x + 1, y: pixel.y },
                { x: pixel.x, y: pixel.y + 1 },
                { x: pixel.x - 1, y: pixel.y },
            ];
            for (const adjacentPixel of adjacentPixels) {
                this.enqueuePixelIfValid(adjacentPixel);
            }
        }
    }

    private enqueuePixelIfValid(pixel: Vec2): void {
        const isPixelInDrawing =
            pixel.x >= 0 && pixel.x < this.drawingService.dimensions.x && pixel.y >= 0 && pixel.y < this.drawingService.dimensions.y;

        if (
            isPixelInDrawing &&
            !this.visitedPixels.has(`${pixel.x} ${pixel.y}`) &&
            this.isSelectedColor(this.rasterizationService.getPixelColor(this.data, this.canvasWidth, pixel))
        ) {
            this.pixelQueue.enqueue(pixel);
        }

        this.visitedPixels.add(`${pixel.x} ${pixel.y}`);
    }

    private addRectangleOnPixel(pixel: Vec2): void {
        const rectangle: SVGPathElement = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(rectangle, 'x', `${pixel.x}`);
        this.renderer.setAttribute(rectangle, 'y', `${pixel.y}`);
        this.renderer.setAttribute(rectangle, 'width', '1');
        this.renderer.setAttribute(rectangle, 'height', '1');
        this.renderer.appendChild(this.group, rectangle);
    }

    private isSelectedColor(color: Color): boolean {
        const distanceFromSelectedColor = Math.sqrt(
            (color.red - this.selectedColor.red) ** 2 +
                (color.green - this.selectedColor.green) ** 2 +
                (color.blue - this.selectedColor.blue) ** 2
        );

        const rgbComponentsCount = 3;
        const maxDistance = Math.sqrt(rgbComponentsCount * Color.maxRgb ** 2);
        const percentageMultiplier = 100;
        const percentageDifference = (distanceFromSelectedColor / maxDistance) * percentageMultiplier;

        return percentageDifference <= this.settings.fillDeviation!; // tslint:disable-line: no-non-null-assertion
    }
}
