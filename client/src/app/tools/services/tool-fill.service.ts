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

enum PixelBorderValue {
    top = 1,
    right = 2,
    bottom = 4,
    left = 8,
}

const totalMatchingTop = [8, 10, 12, 14];
const totalMatchingRight = [1, 5, 9, 13];
const totalMatchingBottom = [2, 3, 11];
const totalMatchingLeft = [4, 6, 7];

@Injectable({
    providedIn: 'root',
})
export class ToolFillService extends Tool {
    private group: SVGGElement;
    private initialColor: Color;

    private pointsQueue = new Queue<Vec2>();
    private validPoints = new Queue<Vec2>();
    private validPointsCopy = new Queue<Vec2>();
    private edgePointMap = new Map<string, Vec2>();
    private vec2ObjectArray: Vec2[][] = [];
    private pointState: boolean[][] = [];

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
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
        if (event.button !== MouseButton.Left || !Tool.isMouseInsideDrawing) {
            return;
        }

        this.group = this.renderer.createElement('g', 'svg');
        this.renderer.setAttribute(this.group, 'fill', this.colorService.primaryColor.toRgbaString());
        this.applyColor();
    }

    private async applyColor(): Promise<void> {
        const point: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        await this.initializeCanvas();
        this.pointsQueue.enqueue(point);
        this.initialColor = this.getPixelColor(point);
        this.breadthFirstSearch();
        this.findAllBorders();
        this.addPathBorder();

        this.drawingService.addElement(this.group as SVGGraphicsElement);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group));

        this.pointsQueue = new Queue<Vec2>();
        this.validPoints = new Queue<Vec2>();
        this.edgePointMap = new Map<string, Vec2>();
        this.pointState = [[]];
        this.vec2ObjectArray = [[]];
    }

    private async initializeCanvas(): Promise<void> {
        this.canvas = await this.rasterizationService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.data = this.context.getImageData(0, 0, this.drawingService.dimensions.x, this.drawingService.dimensions.y).data;
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

    private breadthFirstSearch(): void {
        while (!this.pointsQueue.isEmpty()) {
            const point = this.pointsQueue.dequeue() as Vec2;
            this.verifyPoint({ x: point.x - 1, y: point.y });
            this.verifyPoint({ x: point.x + 1, y: point.y });
            this.verifyPoint({ x: point.x, y: point.y - 1 });
            this.verifyPoint({ x: point.x, y: point.y + 1 });
        }
    }

    private verifyPoint(point: Vec2): void {
        const isInDrawing =
            point.x >= 0 && point.y >= 0 && point.x <= this.drawingService.dimensions.x && point.y <= this.drawingService.dimensions.y;

        if (!isInDrawing) {
            return;
        }

        if (this.pointState[point.x] !== undefined && this.pointState[point.x][point.y] !== undefined) {
            return;
        }

        if (this.pointState[point.x] === undefined) {
            this.pointState[point.x] = [];
        }

        if (this.vec2ObjectArray[point.x] === undefined) {
            this.vec2ObjectArray[point.x] = [];
        }

        if (!this.matchesSelectedColor(this.getPixelColor(point))) {
            this.pointState[point.x][point.y] = false;
            return;
        }
        this.pointState[point.x][point.y] = true;

        this.vec2ObjectArray[point.x][point.y] = { x: point.x, y: point.y };
        this.pointsQueue.enqueue(point);
        this.validPoints.enqueue(point);
        this.validPointsCopy.enqueue(point);
        return;
    }

    private matchesSelectedColor(color: Color): boolean {
        const distanceFromSelectedColor = Math.sqrt(
            Math.pow(color.red - this.initialColor.red, 2) +
                Math.pow(color.green - this.initialColor.green, 2) +
                Math.pow(color.blue - this.initialColor.blue, 2)
        );

        const maximalDistance = 442;
        const percentageMultiplier = 100;
        const percentageDifference = (distanceFromSelectedColor * percentageMultiplier) / maximalDistance;

        // tslint:disable-next-line: no-non-null-assertion
        return percentageDifference <= this.settings.fillDeviation! ? true : false;
    }

    private findAllBorders(): void {
        while (!this.validPointsCopy.isEmpty()) {
            const currentPoint = this.validPointsCopy.dequeue() as Vec2;
            const borderState = this.verifyBorders(currentPoint);
            const nextPixel = this.findVector(currentPoint, borderState);
            if (nextPixel !== undefined) {
                this.edgePointMap.set(this.pointToStringKey(currentPoint), this.vec2ObjectArray[nextPixel.x][nextPixel.y]);
            }
        }
    }

    private verifyBorders(point: Vec2): number {
        let borderValue = 0;

        if (this.pointState[point.x + 1] === undefined) {
            this.pointState[point.x + 1] = [];
        }
        if (this.pointState[point.x - 1] === undefined) {
            this.pointState[point.x - 1] = [];
        }

        borderValue += this.pointState[point.x][point.y + 1] !== true ? PixelBorderValue.top : 0;
        borderValue += this.pointState[point.x + 1][point.y] !== true ? PixelBorderValue.right : 0;
        borderValue += this.pointState[point.x][point.y - 1] !== true ? PixelBorderValue.bottom : 0;
        borderValue += this.pointState[point.x - 1][point.y] !== true ? PixelBorderValue.left : 0;
        return borderValue;
    }

    private findVector(point: Vec2, sideState: number): Vec2 | undefined {
        if (sideState === 0) {
            return undefined;
        }
        let destinationPoint: Vec2 = { x: 0, y: 0 };
        if (totalMatchingTop.includes(sideState)) {
            destinationPoint = { x: point.x, y: point.y + 1 };
        } else if (totalMatchingRight.includes(sideState)) {
            destinationPoint = { x: point.x + 1, y: point.y };
        } else if (totalMatchingRight.includes(sideState)) {
            destinationPoint = { x: point.x + 1, y: point.y };
        } else if (totalMatchingBottom.includes(sideState)) {
            destinationPoint = { x: point.x, y: point.y - 1 };
        } else if (totalMatchingLeft.includes(sideState)) {
            destinationPoint = { x: point.x - 1, y: point.y };
        } else {
            destinationPoint = point;
        }
        return destinationPoint;
    }

    private addPathBorder(): void {
        while (!this.validPoints.isEmpty()) {
            let currentPoint = this.validPoints.dequeue() as Vec2;
            let nextPoint: Vec2;
            let pathString = '';
            if (this.edgePointMap.has(this.pointToStringKey(currentPoint))) {
                pathString += `M${currentPoint.x} ${currentPoint.y} L${currentPoint.x} ${currentPoint.y} `;
                currentPoint = this.edgePointMap.get(this.pointToStringKey(currentPoint)) as Vec2;
            }
            while (this.edgePointMap.has(this.pointToStringKey(currentPoint))) {
                pathString += `L${currentPoint.x} ${currentPoint.y} `;
                nextPoint = this.edgePointMap.get(this.pointToStringKey(currentPoint)) as Vec2;
                this.edgePointMap.delete(this.pointToStringKey(currentPoint));
                currentPoint = nextPoint;
            }
            const path: SVGPathElement = this.renderer.createElement('path', 'svg');
            this.renderer.setAttribute(path, 'fill', 'none');
            this.renderer.setAttribute(path, 'stroke', this.colorService.primaryColor.toRgbaString());
            this.renderer.setAttribute(path, 'stroke-width', '1');
            this.renderer.setAttribute(path, 'stroke-linecap', 'round');
            this.renderer.setAttribute(path, 'stroke-linejoin', 'round');
            this.renderer.setAttribute(path, 'd', pathString);
            this.renderer.appendChild(this.group, path);
        }
    }

    private pointToStringKey(point: Vec2): string {
        return `${point.x} ${point.y}`;
    }

    // private addBorder(): void {
    //     while (!this.validPoints.isEmpty()) {
    //         let point = this.validPoints.dequeue() as Vec2;
    //         while (this.edgePointMap.has(point)) {
    //             const rectangle: SVGPathElement = this.renderer.createElement('rect', 'svg');
    //             this.renderer.setAttribute(rectangle, 'x', `${point.x}`);
    //             this.renderer.setAttribute(rectangle, 'y', `${point.y}`);
    //             this.renderer.setAttribute(rectangle, 'width', '1');
    //             this.renderer.setAttribute(rectangle, 'height', '1');
    //             this.renderer.appendChild(this.group, rectangle);
    //             point = this.edgePointMap.get(point) as Vec2;
    //         }
    //     }
    // }
}
