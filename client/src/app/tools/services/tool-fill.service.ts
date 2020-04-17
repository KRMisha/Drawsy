import { Injectable, RendererFactory2 } from '@angular/core';
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

enum Direction {
    Up,
    UpRight,
    Right,
    DownRight,
    Down,
    DownLeft,
    Left,
    UpLeft,
}

@Injectable({
    providedIn: 'root',
})
export class ToolFillService extends Tool {
    private data: Uint8ClampedArray;
    private canvasWidth: number;
    private selectedColor: Color;

    private fillPixelsToBeVisited: Queue<Vec2>;
    private visitedPixels: Set<string>;

    private pathString: string;

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
            this.fillWithColor();
        }
    }

    // TODO: Make work (important!)
    // onPrimaryColorChange(color: Color): void {
    //     if (this.group !== undefined) {
    //         this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
    //     }
    // }

    private async fillWithColor(): Promise<void> {
        this.fillPixelsToBeVisited = new Queue<Vec2>();
        this.visitedPixels = new Set<string>();
        this.pathString = '';

        await this.initializeCanvas();
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.selectedColor = this.rasterizationService.getPixelColor(this.data, this.canvasWidth, startPixel);

        this.breadthFirstSearch(startPixel);
        this.addFillElement();

        delete this.fillPixelsToBeVisited;
        delete this.visitedPixels;
        delete this.pathString;
    }

    private async initializeCanvas(): Promise<void> {
        const canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
        this.canvasWidth = canvas.width;
    }

    private breadthFirstSearch(startPixel: Vec2): void {
        // this.pathString = `M${startPixel.x} ${startPixel.y} L${startPixel.x} ${startPixel.y} `;

        this.enqueueOrFindContour(startPixel, Direction.Up);

        while (!this.fillPixelsToBeVisited.isEmpty()) {
            const pixel = this.fillPixelsToBeVisited.dequeue()!; // tslint:disable-line: no-non-null-assertion
            this.enqueueOrFindContour({ x: pixel.x, y: pixel.y - 1 }, Direction.Up);
            this.enqueueOrFindContour({ x: pixel.x + 1, y: pixel.y }, Direction.Right);
            this.enqueueOrFindContour({ x: pixel.x, y: pixel.y + 1 }, Direction.Down);
            this.enqueueOrFindContour({ x: pixel.x - 1, y: pixel.y }, Direction.Left);
        }
    }

    private enqueueOrFindContour(pixel: Vec2, direction: Direction): void {
        const isPixelInDrawing =
            pixel.x >= 0 && pixel.x < this.drawingService.dimensions.x && pixel.y >= 0 && pixel.y < this.drawingService.dimensions.y;

        if (!isPixelInDrawing || this.visitedPixels.has(`${pixel.x} ${pixel.y}`)) {
            return;
        }
        this.visitedPixels.add(`${pixel.x} ${pixel.y}`);

        const isPixelFillColor = this.isSelectedColor(this.rasterizationService.getPixelColor(this.data, this.canvasWidth, pixel));
        if (isPixelFillColor) {
            this.fillPixelsToBeVisited.enqueue(pixel);
        } else {
            this.findContour(pixel, direction);
        }
    }

    private getAdjacentPixel(pixel: Vec2, absoluteDirection: Direction): Vec2 {
        switch (absoluteDirection) {
            case Direction.Up:
                return { x: pixel.x, y: pixel.y - 1 };
            case Direction.UpRight:
                return { x: pixel.x + 1, y: pixel.y - 1 };
            case Direction.Right:
                return { x: pixel.x + 1, y: pixel.y };
            case Direction.DownRight:
                return { x: pixel.x + 1, y: pixel.y + 1 };
            case Direction.Down:
                return { x: pixel.x, y: pixel.y + 1 };
            case Direction.DownLeft:
                return { x: pixel.x - 1, y: pixel.y + 1 };
            case Direction.Left:
                return { x: pixel.x - 1, y: pixel.y };
            case Direction.UpLeft:
                return { x: pixel.x - 1, y: pixel.y - 1 };
        }
    }

    private findContour(startPixel: Vec2, startDirection: Direction): void {
        const isRearPixelContour = this.isAdjacentPixelContour(startPixel, startDirection, Direction.Down);
        const isLeftPixelContour = this.isAdjacentPixelContour(startPixel, startDirection, Direction.Left);
        const isRearLeftPixelContour = this.isAdjacentPixelContour(startPixel, startDirection, Direction.DownLeft);

        const isValidStartingPixel = !isRearPixelContour && !(!isRearPixelContour && !isLeftPixelContour && isRearLeftPixelContour);
        if (!isValidStartingPixel) {
            return;
        }

        this.pathString += `M${startPixel.x} ${startPixel.y} L${startPixel.x} ${startPixel.y} `;
        let currentPixel = startPixel;
        let currentDirection = startDirection;

        const maxStartPixelVisitCount = 3;
        let startPixelVisitCount = 0;
        do {
            if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Left)) {
                currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Left);
                currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Left);
            } else {
                if (
                    this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.DownLeft) &&
                    !this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Down)
                ) {
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.DownLeft);
                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Down);
                } else {
                    if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.UpLeft)) {
                        if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Up)) {
                            currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Up);
                            currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Left);
                        } else {
                            currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.UpLeft);
                        }
                    } else if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Up)) {
                        currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Up);
                        currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Right);
                    } else {
                        currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Down);
                    }
                }
            }

            if (currentPixel.x === startPixel.x && currentPixel.y === startPixel.y) {
                startPixelVisitCount++;
            }
        } while (
            !this.isJacobStartingCriterionSatisfied(currentPixel, startPixel, currentDirection, startDirection) &&
            startPixelVisitCount < maxStartPixelVisitCount
        );
    }

    private isAdjacentPixelContour(pixel: Vec2, currentDirection: Direction, relativeDirection: Direction): boolean {
        const adjacentPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(currentDirection, relativeDirection));
        return !this.isSelectedColor(this.rasterizationService.getPixelColor(this.data, this.canvasWidth, adjacentPixel));
    }

    private getAbsoluteDirection(currentDirection: Direction, relativeDirection: Direction): Direction {
        const directionCount = 8;
        return (currentDirection + relativeDirection) % directionCount;
    }

    private getNextPixel(pixel: Vec2, currentDirection: Direction, relativeDirection: Direction): Vec2 {
        const nextPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(currentDirection, relativeDirection));

        this.pathString += `L${nextPixel.x} ${nextPixel.y} `;
        this.visitedPixels.add(`${nextPixel.x} ${nextPixel.y}`);

        return nextPixel;
    }

    private isJacobStartingCriterionSatisfied(
        currentPixel: Vec2,
        startPixel: Vec2,
        currentDirection: Direction,
        startDirection: Direction
    ): boolean {
        return currentPixel.x === startPixel.x && currentPixel.y === startPixel.y && currentDirection === startDirection;
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

    private addFillElement(): void {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(path, 'stroke-width', '1.75');
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
        this.renderer.setAttribute(path, 'd', this.pathString);
        this.drawingService.addElement(path);
        this.historyService.addCommand(new AddElementCommand(this.drawingService, path));
    }
}
