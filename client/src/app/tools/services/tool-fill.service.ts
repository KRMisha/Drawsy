import { Injectable, RendererFactory2 } from '@angular/core';
import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Queue } from '@app/shared/classes/queue';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { SnackbarService } from '@app/shared/services/snackbar.service';
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
        private snackbarService: SnackbarService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Fill);
        this.settings.fillDeviation = ToolDefaults.defaultFillDeviation;
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            const snackbarDuration = 500;
            this.snackbarService.displayMessage('Le remplissage est en cours', snackbarDuration);

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

        const startPixel: Vec2 = {
            x: Math.round(Tool.mousePosition.x),
            y: Math.round(Tool.mousePosition.y),
        };
        await this.initializeCanvas();
        this.selectedColor = this.rasterizationService.getPixelColor(this.canvasData, this.canvasDimensions.x, startPixel);

        const bitmap = this.breadthFirstSearch(startPixel);
        const rectangles = this.getRectanglesFromBitmap(bitmap);
        this.addRectangles(rectangles);

        delete this.fillPixelsToVisit;
        delete this.visitedFillPixels;
    }

    private async initializeCanvas(): Promise<void> {
        this.drawingService.hideUiElements();
        const drawingRootCopy = this.drawingService.drawingRoot.cloneNode(true) as SVGSVGElement;
        this.drawingService.showUiElements();

        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(drawingRootCopy);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        this.canvasDimensions = { x: canvas.width, y: canvas.height };
    }

    private breadthFirstSearch(startPixel: Vec2): boolean[][] {
        this.fillPixelsToVisit.enqueue(startPixel);

        const bitmap: boolean[][] = Array.from(Array(this.canvasDimensions.y), (_: boolean) => Array(this.canvasDimensions.x).fill(false));

        while (!this.fillPixelsToVisit.isEmpty()) {
            // The pixel will always be defined since it can only be added to the queue if it is valid
            const pixel = this.fillPixelsToVisit.dequeue()!; // tslint:disable-line: no-non-null-assertion
            bitmap[pixel.y][pixel.x] = true;

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

        return bitmap;
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

    private addRectangles(rectangles: Rect[]): void {
        this.group = this.renderer.createElement('g', 'svg') as SVGGElement;
        this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());

        for (const rectangle of rectangles) {
            const padding = 0.5;
            const svgRectangle = this.renderer.createElement('rect', 'svg');
            this.renderer.setAttribute(svgRectangle, 'x', `${rectangle.x - padding}`);
            this.renderer.setAttribute(svgRectangle, 'y', `${rectangle.y - padding}`);
            this.renderer.setAttribute(svgRectangle, 'width', `${rectangle.width + 2 * padding}`);
            this.renderer.setAttribute(svgRectangle, 'height', `${rectangle.height + 2 * padding}`);
            this.renderer.appendChild(this.group, svgRectangle);
        }

        this.drawingService.addElement(this.group);
        this.historyService.addCommand(new AddElementCommand(this.drawingService, this.group));
        this.group = undefined;
    }

    private getRectanglesFromBitmap(bitmap: boolean[][]): Rect[] {
        const rectangles: Rect[] = [];
        for (let i = 0; i < bitmap.length; i++) {
            rectangles.push(...this.getRowRectangles(i, bitmap));
        }
        return rectangles;
    }

    private getRowRectangles(rowIndex: number, bitmap: boolean[][]): Rect[] {
        const rectangles: Rect[] = [];

        let currentRectangle: Rect | undefined;
        for (let i = 0; i < bitmap[rowIndex].length; i++) {
            if (currentRectangle !== undefined) {
                if (bitmap[rowIndex][i]) {
                    currentRectangle.width++;
                }

                const hasReachedRectangleEnd = !bitmap[rowIndex][i] || i === bitmap[rowIndex].length - 1;
                if (hasReachedRectangleEnd) {
                    rectangles.push(currentRectangle);
                    currentRectangle = undefined;
                }
            } else if (bitmap[rowIndex][i]) {
                currentRectangle = {
                    x: i,
                    y: rowIndex,
                    width: 1,
                    height: 1,
                } as Rect;
            }
        }

        return rectangles;
    }
}
