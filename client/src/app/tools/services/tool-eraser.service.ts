import { Injectable, RendererFactory2 } from '@angular/core';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementAndItsNeighbor } from '@app/drawing/classes/element-and-its-neighbor';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ToolIcon } from '@app/tools/enums/tool-icon.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEraserService extends Tool {
    private eraserSize = ToolDefaults.defaultEraserSize;
    private svgEraserElement: SVGRectElement;
    private svgSelectedShapeRect: SVGRectElement;

    private svgElementUnderCursor?: SVGElement = undefined;
    private elementUnderCursorStrokeWidth: string;
    private elementUnderCursorStrokeColor: string;

    private isLeftMouseButtonDownInsideDrawing = false;
    private drawingElementsCopy: SVGElement[] = [];
    private svgElementsDeletedDuringDrag: ElementAndItsNeighbor[] = [];

    private eraserRect: Rect;

    private timerId?: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        private svgUtilityService: SvgUtilityService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Eraser, ToolIcon.Eraser);
        this.toolSettings.set(ToolSetting.EraserSize, ToolDefaults.defaultLineWidth);
    }

    afterDrawingInit(): void {
        this.svgEraserElement = this.renderer.createElement('rect', 'svg');
        this.svgEraserElement.setAttribute('fill', 'white');
        this.svgEraserElement.setAttribute('stroke', 'black');
        this.svgEraserElement.setAttribute('stroke-width', '1');
        this.drawingService.addUiElement(this.svgEraserElement);

        const borderColor = Color.fromRgb(235, 64, 52); // tslint:disable-line: no-magic-numbers
        this.svgSelectedShapeRect = this.svgUtilityService.createDashedRectBorder(borderColor);
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
        this.drawingService.addUiElement(this.svgSelectedShapeRect);
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getMousePosition(event);
        const msDelayBetweenCalls = 32;
        this.updateEraserRect(mousePosition);
        if (this.timerId === undefined) {
            this.timerId = window.setTimeout(() => {
                this.onMousePositionChange(mousePosition);
            }, msDelayBetweenCalls);
        }
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getMousePosition(event);
        this.isLeftMouseButtonDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.drawingElementsCopy = [...this.drawingService.svgElements];
        this.onMousePositionChange(mousePosition);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.svgElementsDeletedDuringDrag.length > 0) {
            const elementIndices = new Map<SVGElement, number>();
            for (let i = 0; i < this.drawingElementsCopy.length; i++) {
                elementIndices.set(this.drawingElementsCopy[i], i);
            }
            this.svgElementsDeletedDuringDrag.sort((element1: ElementAndItsNeighbor, element2: ElementAndItsNeighbor) => {
                return (elementIndices.get(element2.element) as number) - (elementIndices.get(element1.element) as number);
            });
            this.commandService.addCommand(new RemoveElementsCommand(this.drawingService, this.svgElementsDeletedDuringDrag));
            this.svgElementsDeletedDuringDrag = [];
        }
    }

    onEnter(): void {
        this.renderer.setAttribute(this.svgEraserElement, 'display', 'block');
    }

    onLeave(): void {
        this.renderer.setAttribute(this.svgEraserElement, 'display', 'none');
    }

    onToolDeselection(): void {
        this.svgEraserElement.setAttribute('display', 'none');
        this.svgSelectedShapeRect.setAttribute('display', 'none');
        this.restoreElementUnderCursorAttributes();
        this.svgElementUnderCursor = undefined;
    }

    private updateEraserRect(mousePosition: Vec2): void {
        this.eraserSize = this.toolSettings.get(ToolSetting.EraserSize) as number;
        this.eraserRect = this.getEraserRectFromMousePosition(mousePosition);
        this.updateVisibleRect(this.svgEraserElement, this.eraserRect);
    }

    private onMousePositionChange(mousePosition: Vec2): void {
        this.timerId = undefined;
        const elementToConsider = this.svgUtilityService.getElementUnderAreaPixelPerfect(this.drawingService.svgElements, this.eraserRect);

        if (elementToConsider === undefined) {
            this.restoreElementUnderCursorAttributes();
            this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
            this.svgElementUnderCursor = undefined;
            return;
        }

        if (elementToConsider !== this.svgElementUnderCursor) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = elementToConsider;
            this.addRedBorderToElement(elementToConsider);
            this.displayRedRectAroundElement(elementToConsider);
        }

        if (this.svgElementUnderCursor !== undefined && Tool.isLeftMouseButtonDown && this.isLeftMouseButtonDownInsideDrawing) {
            this.restoreElementUnderCursorAttributes();
            this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
            const elementIndex = this.drawingElementsCopy.indexOf(this.svgElementUnderCursor);
            if (elementIndex >= 0) {
                this.svgElementsDeletedDuringDrag.push({
                    element: this.svgElementUnderCursor,
                    neighbor: this.drawingElementsCopy[elementIndex + 1],
                });
            }
            this.drawingService.removeElement(this.svgElementUnderCursor);
            this.svgElementUnderCursor = undefined;
        }
    }

    private getEraserRectFromMousePosition(mousePosition: Vec2): Rect {
        const rect: Rect = {
            x: mousePosition.x - this.eraserSize / 2,
            y: mousePosition.y - this.eraserSize / 2,
            width: this.eraserSize,
            height: this.eraserSize,
        };
        return rect;
    }

    private updateVisibleRect(element: SVGRectElement, rect: Rect): void {
        this.svgUtilityService.updateSvgRectFromRect(element, rect);
        this.renderer.setAttribute(element, 'display', 'block');
    }

    private addRedBorderToElement(element: SVGElement): void {
        const elementStrokeWidth = element.getAttribute('stroke-width');
        const elementStrokeColor = element.getAttribute('stroke');

        this.elementUnderCursorStrokeColor = elementStrokeColor ? elementStrokeColor : 'none';
        this.elementUnderCursorStrokeWidth = elementStrokeWidth ? elementStrokeWidth : 'none';

        let borderColor = 'rgb(255, 0, 0)';
        if (this.elementUnderCursorStrokeColor !== 'none') {
            const elementColor = Color.fromRgbString(this.elementUnderCursorStrokeColor);
            const distanceFromRed = Math.sqrt(
                Math.pow(elementColor.red - Color.maxRgb, 2) + Math.pow(elementColor.green, 2) + Math.pow(elementColor.blue, 2)
            );
            const maxDistanceFromRed = 50;
            if (distanceFromRed <= maxDistanceFromRed) {
                borderColor = 'rgb(150, 0, 0)';
            }
        }

        const defaultBorderWidth = 3;
        let borderWidth = defaultBorderWidth;
        if (this.elementUnderCursorStrokeWidth !== 'none') {
            const borderIncreaseFactor = 1.08;
            borderWidth += +this.elementUnderCursorStrokeWidth * borderIncreaseFactor;
        }

        this.renderer.setAttribute(element, 'stroke', borderColor);
        this.renderer.setAttribute(element, 'stroke-width', borderWidth.toString());
    }

    private restoreElementUnderCursorAttributes(): void {
        if (this.svgElementUnderCursor !== undefined) {
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke', this.elementUnderCursorStrokeColor);
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke-width', this.elementUnderCursorStrokeWidth);
        }
    }

    private displayRedRectAroundElement(element: SVGElement): void {
        const rect = this.svgUtilityService.getElementBounds(element);
        this.updateVisibleRect(this.svgSelectedShapeRect, rect);
        this.renderer.setAttribute(this.svgElementUnderCursor, 'display', 'block');
    }
}
