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
    private group?: SVGGElement;

    private data: Uint8ClampedArray;
    private canvasWidth: number;
    private selectedColor: Color;

    private pixelQueue: Queue<[Vec2, Direction]>;
    private visitedPixels: Set<string>;

    // private currentAbsoluteDirection: Direction;
    // private currentPixel: Vec2;
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
            this.group = this.renderer.createElement('g', 'svg') as SVGGElement;
            this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
            this.fillWithColor();
        }
    }

    onPrimaryColorChange(color: Color): void {
        if (this.group !== undefined) {
            this.renderer.setAttribute(this.group, 'fill', color.toRgbaString());
        }
    }

    private async fillWithColor(): Promise<void> {
        this.pixelQueue = new Queue<[Vec2, Direction]>();
        this.visitedPixels = new Set<string>();
        this.pathString = '';

        await this.initializeCanvas();
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.selectedColor = this.getPixelColor(startPixel);
        this.breadthFirstSearch(startPixel);

        // tslint:disable: no-non-null-assertion
        this.drawingService.addElement(this.group!);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group!));
        // tslint:enable: no-non-null-assertion

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

    private getPixelColor(pixelPosition: Vec2): Color {
        const colorValuesCount = 4;
        const colorIndex = pixelPosition.y * (this.canvasWidth * colorValuesCount) + pixelPosition.x * colorValuesCount;

        const rgbaComponents: number[] = [];
        for (let i = 0; i < colorValuesCount; i++) {
            rgbaComponents.push(this.data[colorIndex + i]);
        }
        const [red, green, blue, alpha] = rgbaComponents;
        return Color.fromRgba(red, green, blue, alpha / Color.maxRgb);
    }

    private breadthFirstSearch(startPixel: Vec2): void {
        this.pixelQueue.enqueue([startPixel, Direction.Up]);

        while (!this.pixelQueue.isEmpty()) {
            const [pixel, direction] = this.pixelQueue.dequeue()!; // tslint:disable-line: no-non-null-assertion
            this.visitPixel(pixel, direction);

            const adjacentPixelDirectionPairs: [Vec2, Direction][] = [
                [{ x: pixel.x, y: pixel.y - 1 }, Direction.Up],
                [{ x: pixel.x + 1, y: pixel.y }, Direction.Right],
                [{ x: pixel.x, y: pixel.y + 1 }, Direction.Down],
                [{ x: pixel.x - 1, y: pixel.y }, Direction.Left],
            ];
            for (const pixelDirectionPair of adjacentPixelDirectionPairs) {
                this.enqueuePixelIfUnvisited(pixelDirectionPair);
            }
        }
    }

    private enqueuePixelIfUnvisited(pixelDirectionPair: [Vec2, Direction]): void {
        const pixel = pixelDirectionPair[0];

        const isPixelInDrawing =
            pixel.x >= 0 && pixel.x < this.drawingService.dimensions.x && pixel.y >= 0 && pixel.y < this.drawingService.dimensions.y;

        if (isPixelInDrawing && !this.visitedPixels.has(`${pixel.x} ${pixel.y}`)) {
            this.pixelQueue.enqueue(pixelDirectionPair);
        }
    }

    private visitPixel(pixel: Vec2, direction: Direction): void {
        this.visitedPixels.add(`${pixel.x} ${pixel.y}`);

        if (this.isSelectedColor(this.getPixelColor(pixel))) {
            return;
        }

        const isRearPixelContour = this.isAdjacentPixelContour(pixel, direction, Direction.Down);
        const isLeftPixelContour = this.isAdjacentPixelContour(pixel, direction, Direction.Left);
        const isRearLeftPixelContour = this.isAdjacentPixelContour(pixel, direction, Direction.DownLeft);

        // const rearPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(direction, Direction.Down));
        // const rearLeftPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(direction, Direction.DownLeft));
        // const leftPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(direction, Direction.Left));

        // const isRearPixelConditionSatisfied = this.isSelectedColor(this.getPixelColor(rearPixel));
        // const isLeftRearInnerOuterCornerConditionSatisfied =
        //     isRearPixelConditionSatisfied &&
        //     this.isSelectedColor(this.getPixelColor(leftPixel)) &&
        //     !this.isSelectedColor(this.getPixelColor(rearLeftPixel));

        // !isRearPixelContour && (!isRearPixelContour && !isLeft(!isRearPixelContourPixelContour && isRearLeftPixelContour)
        const isValidStartingPixel = !isRearPixelContour && !isLeftPixelContour && isRearLeftPixelContour;
        if (isValidStartingPixel) {
            this.traceContour(pixel, direction);
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

    private traceContour(startPixel: Vec2, startDirection: Direction): void {
        this.pathString = `M${startPixel.x} ${startPixel.y} L${startPixel.x} ${startPixel.y} `;
        // this.currentAbsoluteDirection = absoluteDirection;
        // this.currentPixel = pixel;
        let currentPixel = startPixel;
        let currentDirection = startDirection;
        // let i = 0;
        do {
            if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.DownLeft)) {
                if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Left)) {
                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Left);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Left);

                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Left);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Left);
                } else {
                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Down);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.DownLeft);
                }
            } else {
                if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Left)) {
                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Left);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Left);
                } else {
                    // Do nothing
                }
            }

            if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.UpLeft)) {
                if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Up)) {
                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Left);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Up);

                    currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Right);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Up);
                } else {
                    // currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Up);
                    currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.UpLeft);
                }
            } else if (this.isAdjacentPixelContour(currentPixel, currentDirection, Direction.Up)) {
                currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Right);
                currentPixel = this.getNextPixel(currentPixel, currentDirection, Direction.Up);
            } else {
                currentDirection = this.getAbsoluteDirection(currentDirection, Direction.Down);
            }

            // i++;
        } while (currentPixel.x !== startPixel.x || currentPixel.y !== startPixel.y || currentDirection !== startDirection);
        this.addPathBorder();
    }

    private isAdjacentPixelContour(pixel: Vec2, currentDirection: Direction, relativeDirection: Direction): boolean {
        const adjacentPixel = this.getAdjacentPixel(pixel, this.getAbsoluteDirection(currentDirection, relativeDirection));
        return !this.isSelectedColor(this.getPixelColor(adjacentPixel));
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

    private addPathBorder(): void {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        // TODO: Check if fill attribute is unnecessary
        this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(path, 'd', this.pathString);
        this.renderer.appendChild(this.group, path);
    }
}
