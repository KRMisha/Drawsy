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
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEraserService extends Tool {
    private eraserSize = ToolDefaults.defaultEraserSize;
    private svgEraserElement: SVGRectElement;

    private svgElementUnderCursor?: SVGGraphicsElement = undefined;
    private elementUnderCursorStrokeWidth: string;
    private elementUnderCursorStrokeColor: string;

    private isLeftMouseButtonDownInsideDrawing = false;
    private drawingElementsCopy: SVGGraphicsElement[] = [];
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
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Eraser);
        this.settings.eraserSize = ToolDefaults.defaultEraserSize;
        this.svgEraserElement = this.renderer.createElement('rect', 'svg');
        this.svgEraserElement.setAttribute('fill', 'white');
        this.svgEraserElement.setAttribute('stroke', 'black');
        this.svgEraserElement.setAttribute('stroke-width', '1');
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getMousePosition(event);
        const msDelayBetweenCalls = 32;
        this.updateEraserRect(mousePosition);
        if (this.timerId === undefined) {
            this.timerId = window.setTimeout(() => {
                this.update(mousePosition);
            }, msDelayBetweenCalls);
        }
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getMousePosition(event);
        this.isLeftMouseButtonDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.drawingElementsCopy = [...this.drawingService.svgElements];
        this.update(mousePosition);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.svgElementsDeletedDuringDrag.length > 0) {
            const elementIndices = new Map<SVGGraphicsElement, number>();
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

    update(mousePosition: Vec2): void {
        this.timerId = undefined;
        const elementToConsider = this.svgUtilityService.getElementUnderAreaPixelPerfect(this.drawingService.svgElements, this.eraserRect);

        if (elementToConsider === undefined) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = undefined;
            return;
        }

        if (elementToConsider !== this.svgElementUnderCursor) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = elementToConsider;
            this.addRedBorderToElement(elementToConsider);
        }

        if (this.svgElementUnderCursor !== undefined && Tool.isLeftMouseButtonDown && this.isLeftMouseButtonDownInsideDrawing) {
            this.restoreElementUnderCursorAttributes();
            const elementIndex = this.drawingElementsCopy.indexOf(this.svgElementUnderCursor);
            if (elementIndex !== -1) {
                this.svgElementsDeletedDuringDrag.push({
                    element: this.svgElementUnderCursor,
                    neighbor: this.drawingElementsCopy[elementIndex + 1],
                });
                this.drawingService.removeElement(this.svgElementUnderCursor);
            }
            this.svgElementUnderCursor = undefined;
        }
    }

    onToolSelection(mousePosition: Vec2): void {
        this.drawingService.addUiElement(this.svgEraserElement);
    }

    onToolDeselection(): void {
        this.drawingService.removeUiElement(this.svgEraserElement);
        this.restoreElementUnderCursorAttributes();
        this.svgElementUnderCursor = undefined;
    }

    private updateEraserRect(mousePosition: Vec2): void {
        this.eraserSize = this.settings.eraserSize!; // tslint:disable-line: no-non-null-assertion
        this.eraserRect = {
            x: mousePosition.x - this.eraserSize / 2,
            y: mousePosition.y - this.eraserSize / 2,
            width: this.eraserSize,
            height: this.eraserSize,
        };
        this.svgUtilityService.updateSvgRectFromRect(this.svgEraserElement, this.eraserRect);
    }

    private addRedBorderToElement(element: SVGGraphicsElement): void {
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
}
