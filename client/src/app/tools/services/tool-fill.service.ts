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

enum Direction { // todo pascalcase
    top,
    topRight,
    right,
    bottomRight,
    bottom,
    bottomLeft,
    left,
    topLeft,
} // todo rename top -> up, bottom -> down

@Injectable({
    providedIn: 'root',
})
export class ToolFillService extends Tool {
    private group: SVGGElement;

    private selectedColor: Color;

    private pixelQueue = new Queue<[Vec2, Direction]>();
    // private visitedEdgePixels = new Set<string>();
    private visitedPixels = new Set<string>();

    private currentAbsoluteDirection: Direction;
    private currentPixel: Vec2;
    private pathString = '';

    private canvas: HTMLCanvasElement;
    // private context: CanvasRenderingContext2D;
    private data: Uint8ClampedArray;

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
            this.group = this.renderer.createElement('g', 'svg');
            this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
            this.fillWithColor();
        }
    }

    private async fillWithColor(): Promise<void> {
        const startPixel: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        await this.initializeCanvas();
        this.selectedColor = this.getPixelColor(startPixel);
        this.breadthFirstSearch(startPixel);

        this.drawingService.addElement(this.group as SVGGraphicsElement);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group));

        this.pixelQueue = new Queue<[Vec2, Direction]>();
        // this.visitedEdgePixels = new Set<string>();
        this.visitedPixels = new Set<string>();
        this.pathString = '';
    }

    private async initializeCanvas(): Promise<void> {
        this.canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.data = context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
    }

    private getPixelColor(pixelPosition: Vec2): Color {
        const colorValuesCount = 4;
        const colorIndex = pixelPosition.y * (this.canvas.width * colorValuesCount) + pixelPosition.x * colorValuesCount;

        const rgbaComponents: number[] = [];
        for (let i = 0; i < colorValuesCount; i++) {
            rgbaComponents.push(this.data[colorIndex + i]);
        }
        const [red, green, blue, alpha] = rgbaComponents;
        return Color.fromRgba(red, green, blue, alpha / Color.maxRgb);
    }

    private breadthFirstSearch(startPixel: Vec2): void {
        this.pixelQueue.enqueue([startPixel, Direction.top]);

        while (!this.pixelQueue.isEmpty()) {
            const [pixel, direction] = this.pixelQueue.dequeue()!; // tslint:disable-line: no-non-null-assertion
            this.visitPixel(pixel, direction);
            this.pixelQueue.enqueue([{ x: pixel.x, y: pixel.y + 1 }, Direction.top]);
            this.pixelQueue.enqueue([{ x: pixel.x + 1, y: pixel.y }, Direction.right]);
            this.pixelQueue.enqueue([{ x: pixel.x, y: pixel.y - 1 }, Direction.bottom]);
            this.pixelQueue.enqueue([{ x: pixel.x - 1, y: pixel.y }, Direction.left]);
        }
    }

    private visitPixel(pixel: Vec2, absoluteDirection: Direction): void {
        // if (pixel === undefined) {
        //     return;
        // }

        const isInDrawing =
            pixel.x >= 0 && pixel.y >= 0 && pixel.x <= this.drawingService.dimensions.x && pixel.y <= this.drawingService.dimensions.y;

        if (!isInDrawing || this.visitedPixels.has(`${pixel.x} ${pixel.y}`)) {
            return;
        }

        this.visitedPixels.add(`${pixel.x} ${pixel.y}`);

        if (this.isSelectedColor(this.getPixelColor(pixel))) {
            return;
        }

        const rearPixel = this.findNextPixel(pixel, this.findAbsoluteDirection(absoluteDirection, Direction.bottom));
        const rearLeftPixel = this.findNextPixel(pixel, this.findAbsoluteDirection(absoluteDirection, Direction.bottomLeft));
        const leftPixel = this.findNextPixel(pixel, this.findAbsoluteDirection(absoluteDirection, Direction.left));

        const isRearPixelConditionSatisfied = this.isSelectedColor(this.getPixelColor(rearPixel));
        const isLeftRearInnerOuterCornerConditionSatisfied =
            isRearPixelConditionSatisfied &&
            this.isSelectedColor(this.getPixelColor(leftPixel)) &&
            !this.isSelectedColor(this.getPixelColor(rearLeftPixel));

        const isValidStartingPixel = isRearPixelConditionSatisfied && !isLeftRearInnerOuterCornerConditionSatisfied;
        if (isValidStartingPixel) {
            this.traceContour(pixel, absoluteDirection);
        }
    }

    private traceContour(pixel: Vec2, absoluteDirection: Direction): void {
        this.pathString = `M${pixel.x} ${pixel.y} L${pixel.x} ${pixel.y} `;
        this.currentAbsoluteDirection = absoluteDirection;
        this.currentPixel = pixel;
        do {
            if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.bottomLeft)) {
                if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.left)) {
                    this.updatePath(Direction.left, Direction.left);
                    this.updatePath(Direction.left, Direction.left);
                } else {
                    this.updatePath(Direction.bottomLeft, Direction.bottom);
                }
            } else {
                if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.left)) {
                    this.updatePath(Direction.left, Direction.left);
                }
                // else {
                //     i += 1;
                // }
            }

            if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.topLeft)) {
                if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.top)) {
                    this.updatePath(Direction.top, Direction.left);
                    this.updatePath(Direction.left, Direction.right);
                } else {
                    this.updatePath(Direction.topLeft, -1);
                }
            } else if (this.isNextPixelOddColor(this.currentPixel, this.currentAbsoluteDirection, Direction.top)) {
                this.updatePath(Direction.top, Direction.right);
            } else {
                this.updatePath(-1, Direction.bottom);
            }
        } while (
            !(this.currentPixel.x === pixel.x && this.currentPixel.y === pixel.y) &&
            this.currentAbsoluteDirection !== absoluteDirection
        );
        this.addPathBorder();
    }

    private updatePath(pixelDirection: Direction, newDirection: Direction): void {
        if (pixelDirection !== -1) {
            this.currentPixel = this.findNextPixel(
                this.currentPixel,
                this.findAbsoluteDirection(this.currentAbsoluteDirection, pixelDirection)
            );
        }
        if (newDirection !== -1) {
            this.currentAbsoluteDirection = this.findAbsoluteDirection(this.currentAbsoluteDirection, newDirection);
        }
        this.pathString += `L${this.currentPixel.x} ${this.currentPixel.y} `;
        this.visitedPixels.add(`${this.currentPixel.x} ${this.currentPixel.y}`);
    }

    private findAbsoluteDirection(currentAbsoluteDirection: Direction, newRelativeDirection: Direction): Direction {
        const directionCount = 8;
        return (currentAbsoluteDirection + newRelativeDirection) % directionCount;
    }

    private findNextPixel(pixel: Vec2, absoluteDirection: Direction): Vec2 {
        switch (absoluteDirection) {
            case Direction.top:
                return { x: pixel.x, y: pixel.y + 1 };
            case Direction.topRight:
                return { x: pixel.x + 1, y: pixel.y + 1 };
            case Direction.right:
                return { x: pixel.x + 1, y: pixel.y };
            case Direction.bottomRight:
                return { x: pixel.x + 1, y: pixel.y - 1 };
            case Direction.bottom:
                return { x: pixel.x, y: pixel.y - 1 };
            case Direction.bottomLeft:
                return { x: pixel.x - 1, y: pixel.y - 1 };
            case Direction.left:
                return { x: pixel.x - 1, y: pixel.y };
            case Direction.topLeft:
                return { x: pixel.x - 1, y: pixel.y + 1 };
        }
    }

    private isSelectedColor(color: Color): boolean {
        const distanceFromSelectedColor = Math.sqrt(
            Math.pow(color.red - this.selectedColor.red, 2) +
                Math.pow(color.green - this.selectedColor.green, 2) +
                Math.pow(color.blue - this.selectedColor.blue, 2)
        );

        const maxDistance = 442;
        const percentageMultiplier = 100;
        const percentageDifference = (distanceFromSelectedColor * percentageMultiplier) / maxDistance;

        // tslint:disable-next-line: no-non-null-assertion
        return percentageDifference <= this.settings.fillDeviation!;
    }

    private isNextPixelOddColor(pixel: Vec2, absoluteDirection: Direction, newRelativeDirection: Direction): boolean {
        return !this.isSelectedColor(
            this.getPixelColor(this.findNextPixel(pixel, this.findAbsoluteDirection(absoluteDirection, newRelativeDirection)))
        );
    }

    private addPathBorder(): void {
        const path: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(path, 'fill', this.colorService.primaryColor.toRgbaString());
        this.renderer.setAttribute(path, 'stroke-width', '1');
        this.renderer.setAttribute(path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(path, 'd', this.pathString);
        this.renderer.appendChild(this.group, path);
    }
}
