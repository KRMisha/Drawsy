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

    private pixelQueue: Queue<[Vec2, Direction]>;
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

    // onPrimaryColorChange(color: Color): void {
    //     if (this.group !== undefined) {
    //         this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
    //     }
    // }

    private async fillWithColor(): Promise<void> {
        this.pixelQueue = new Queue<[Vec2, Direction]>();
        this.visitedPixels = new Set<string>();
        this.pathString = '';

        await this.initializeCanvas();
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.selectedColor = this.rasterizationService.getPixelColor(this.data, this.canvasWidth, startPixel);
        this.breadthFirstSearch(startPixel);
        this.addFillElement();

        delete this.pixelQueue;
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
        this.pixelQueue.enqueue([startPixel, Direction.Up]);
        this.pathString = `M${startPixel.x} ${startPixel.y} L${startPixel.x} ${startPixel.y} `;

        while (!this.pixelQueue.isEmpty()) {
            // The pixel will always be defined since it can only be added to the queue if it is valid
            const pixelDirectionPair = this.pixelQueue.dequeue()!; // tslint:disable-line: no-non-null-assertion
            // this.visitPixel(pixelDirectionPair[0], pixelDirectionPair[1]);

            this.verifyStartingPixel({ x: pixelDirectionPair[0].x, y: pixelDirectionPair[0].y + 1 }, Direction.Up);
            this.verifyStartingPixel({ x: pixelDirectionPair[0].x + 1, y: pixelDirectionPair[0].y }, Direction.Right);
            this.verifyStartingPixel({ x: pixelDirectionPair[0].x, y: pixelDirectionPair[0].y - 1 }, Direction.Down);
            this.verifyStartingPixel({ x: pixelDirectionPair[0].x - 1, y: pixelDirectionPair[0].y }, Direction.Left);
        }
    }

    private verifyStartingPixel(pixel: Vec2, absoluteDirection: Direction): void {
        const isInDrawing =
            pixel.x >= 0 && pixel.x < this.drawingService.dimensions.x && pixel.y >= 0 && pixel.y < this.drawingService.dimensions.y;

        if (!isInDrawing || this.visitedPixels.has(`${pixel.x} ${pixel.y}`)) {
            return;
        }

        this.visitedPixels.add(`${pixel.x} ${pixel.y}`);
        if (this.isSelectedColor(this.rasterizationService.getPixelColor(this.data, this.canvasWidth, pixel))) {
            this.pixelQueue.enqueue([pixel, absoluteDirection]);
            return;
        }

        this.findContour(pixel, absoluteDirection);
    }

    // private enqueuePixelIfUnvisited(pixelDirectionPair: [Vec2, Direction]): void {
    //     const pixel = pixelDirectionPair[0];
    //     const direction = pixelDirectionPair[1];

    //     const isPixelInDrawing =
    //         pixel.x >= 0 && pixel.x < this.drawingService.dimensions.x && pixel.y >= 0 && pixel.y < this.drawingService.dimensions.y;

    //     if (isPixelInDrawing && !this.visitedPixels.has(`${pixel.x} ${pixel.y}`)) {
    //         this.pixelQueue.enqueue([pixel, direction]);
    //     }
    // }

    // private visitPixel(pixel: Vec2, direction: Direction): void {
    //     this.visitedPixels.add(`${pixel.x} ${pixel.y}`);

    //     if (this.isSelectedColor(this.rasterizationService.getPixelColor(this.data, this.canvasWidth, pixel))) {
    //         return;
    //     }

    //     this.findContour(pixel, direction);
    // }

    private getAdjacentPixel(pixel: Vec2, absoluteDirection: Direction): Vec2 {
        switch (absoluteDirection) {
            case Direction.Up:
                return { x: pixel.x, y: pixel.y + 1 };
            case Direction.UpRight:
                return { x: pixel.x + 1, y: pixel.y + 1 };
            case Direction.Right:
                return { x: pixel.x + 1, y: pixel.y };
            case Direction.DownRight:
                return { x: pixel.x + 1, y: pixel.y - 1 };
            case Direction.Down:
                return { x: pixel.x, y: pixel.y - 1 };
            case Direction.DownLeft:
                return { x: pixel.x - 1, y: pixel.y - 1 };
            case Direction.Left:
                return { x: pixel.x - 1, y: pixel.y };
            case Direction.UpLeft:
                return { x: pixel.x - 1, y: pixel.y + 1 };
        }
    }

    private findContour(startPixel: Vec2, startDirection: Direction): void {
        this.pathString += `M${startPixel.x} ${startPixel.y} L${startPixel.x} ${startPixel.y} `;
        let currentPixel = startPixel;
        let currentDirection = startDirection;

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
        } while (currentPixel.x !== startPixel.x || currentPixel.y !== startPixel.y || currentDirection !== startDirection);
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
        const path = this.renderer.createElement('path', 'svg') as SVGPathElement;
        this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(path, 'fill-rule', 'nonzero');
        this.renderer.setAttribute(path, 'd', this.pathString);
        // tslint:disable: no-non-null-assertion
        this.drawingService.addElement(path);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, path));
        // tslint:enable: no-non-null-assertion
    }
}
