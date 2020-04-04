import { Injectable, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
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
    private group: SVGGElement;
    private selectedColor: Color;

    private pointsQueue: Queue<Vec2>;
    private visitedPoints: Set<string>;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: Uint8ClampedArray;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private svgUtilityService: SvgUtilityService
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
        this.drawingService.addElement(this.group as SVGGraphicsElement);
        this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.group));
    }

    private async applyColor(): Promise<void> {
        const point: Vec2 = { x: Math.round(Tool.mousePosition.x), y: Math.round(Tool.mousePosition.y) };
        this.pointsQueue = new Queue<Vec2>();
        this.visitedPoints = new Set<string>();
        this.pointsQueue.enqueue(point);
        await this.initializeCanvas();
        this.selectedColor = this.getPixelColor(point);
        this.breadthFirstSearch();
    }

    private async initializeCanvas(): Promise<void> {
        this.canvas = await this.svgUtilityService.getCanvasFromSvgRoot(this.drawingService.drawingRoot);
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

    private async breadthFirstSearch(): Promise<void> {
        while (!this.pointsQueue.isEmpty()) {
            const point = this.pointsQueue.dequeue() as Vec2;
            this.addRectangeOnPoint({ x: point.x - 1, y: point.y });
            this.addRectangeOnPoint({ x: point.x + 1, y: point.y });
            this.addRectangeOnPoint({ x: point.x, y: point.y - 1 });
            this.addRectangeOnPoint({ x: point.x, y: point.y + 1 });
        }
    }

    private addRectangeOnPoint(point: Vec2): void {
        if (!this.verifyPoint(point)) {
            return;
        }
        const circle: SVGPathElement = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(circle, 'x', `${point.x}`);
        this.renderer.setAttribute(circle, 'y', `${point.y}`);
        this.renderer.setAttribute(circle, 'width', '1');
        this.renderer.setAttribute(circle, 'height', '1');
        this.renderer.appendChild(this.group, circle);

        this.pointsQueue.enqueue(point);
    }

    private verifyPoint(point: Vec2): boolean {
        const drawingDimensions = this.drawingService.dimensions;
        const isInDrawing = point.x >= 0 || point.y >= 0 || point.x <= drawingDimensions.x || point.y <= drawingDimensions.y;
        const pointString = `${point.x}, ${point.y}`;
        if (!isInDrawing || this.visitedPoints.has(pointString)) {
            return false;
        }
        this.visitedPoints.add(pointString);

        if (!this.compareColors(point)) {
            return false;
        }

        return true;
    }

    private compareColors(point: Vec2): boolean {
        const pointColor = this.getPixelColor(point);
        const distanceFromSelectedColor = Math.sqrt(
            Math.pow(pointColor.red - this.selectedColor.red, 2) +
                Math.pow(pointColor.green - this.selectedColor.green, 2) +
                Math.pow(pointColor.blue - this.selectedColor.blue, 2)
        );
        const maximalDistance = 442;
        // The number 100 is used here to convert the distance to a percentage, because the user selects the deviation in percentage
        // tslint:disable-next-line: no-magic-numbers
        const percentageDifference = (distanceFromSelectedColor * 100) / maximalDistance;
        // tslint:disable-next-line: no-non-null-assertion
        return percentageDifference <= this.settings.fillDeviation! ? true : false;
    }
}
