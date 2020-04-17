import { Injectable, RendererFactory2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
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

    private canvasData: Uint8ClampedArray;
    private canvasDimensions: Vec2;

    private selectedColor: Color;

    private fillPixelsToVisit: Queue<Vec2>;
    private visitedFillPixels: Set<string>;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private rasterizationService: RasterizationService,
        private snackBar: MatSnackBar
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Fill);
        this.settings.fillDeviation = ToolDefaults.defaultFillDeviation;
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            const snackBarDuration = 500;
            this.snackBar.open('Le remplissage est en cours', undefined, {
                duration: snackBarDuration,
            });

            this.fillWithColor();
        }
    }

    onPrimaryColorChange(color: Color): void {
        if (this.group !== undefined) {
            this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
        }
    }

    private async fillWithColor(): Promise<void> {
        this.fillPixelsToVisit = new Queue<Vec2>();
        this.visitedFillPixels = new Set<string>();

        this.group = this.renderer.createElement('g', 'svg') as SVGGElement;
        this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());

        await this.initializeCanvas();
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.selectedColor = this.rasterizationService.getPixelColor(this.canvasData, this.canvasDimensions.x, startPixel);

        this.breadthFirstSearch(startPixel);

        this.drawingService.addElement(this.group);
        this.historyService.addCommand(new AddElementCommand(this.drawingService, this.group));
        this.group = undefined;

        delete this.fillPixelsToVisit;
        delete this.visitedFillPixels;
    }

    private async initializeCanvas(): Promise<void> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        this.canvasDimensions = { x: canvas.width, y: canvas.height };
    }

    private breadthFirstSearch(startPixel: Vec2): void {
        this.fillPixelsToVisit.enqueue(startPixel);

        while (!this.fillPixelsToVisit.isEmpty()) {
            // The pixel will always be defined since it can only be added to the queue if it is valid
            const pixel = this.fillPixelsToVisit.dequeue()!; // tslint:disable-line: no-non-null-assertion
            this.addSquareOnPixel(pixel);

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

    private addSquareOnPixel(pixel: Vec2): void {
        const square: SVGPathElement = this.renderer.createElement('rect', 'svg');
        const squareSideSize = 1.8;
        this.renderer.setAttribute(square, 'x', `${pixel.x - (squareSideSize - 1) / 2}`);
        this.renderer.setAttribute(square, 'y', `${pixel.y - (squareSideSize - 1) / 2}`);
        this.renderer.setAttribute(square, 'width', squareSideSize.toString());
        this.renderer.setAttribute(square, 'height', squareSideSize.toString());
        this.renderer.appendChild(this.group, square);
    }

    private enqueuePixelIfValid(pixel: Vec2): void {
        const isPixelInDrawing = pixel.x >= 0 && pixel.x < this.canvasDimensions.x && pixel.y >= 0 && pixel.y < this.canvasDimensions.y;
        const isPixelFillColor = this.isSelectedColor(
            this.rasterizationService.getPixelColor(this.canvasData, this.canvasDimensions.x, pixel)
        );
        if (!isPixelInDrawing || !isPixelFillColor) {
            return;
        }

        if (this.visitedFillPixels.has(`${pixel.x} ${pixel.y}`)) {
            return;
        }

        this.visitedFillPixels.add(`${pixel.x} ${pixel.y}`);
        this.fillPixelsToVisit.enqueue(pixel);
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
