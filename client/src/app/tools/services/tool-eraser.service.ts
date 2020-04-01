import { Injectable, RendererFactory2 } from '@angular/core';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';

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
    private svgElementsDeletedDuringDrag: ElementSiblingPair[] = [];

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
    }

    onMouseMove(): void {
        const msDelayBetweenCalls = 16;
        this.updateEraserRect();
        if (this.timerId === undefined) {
            this.timerId = window.setTimeout(() => {
                this.update();
                this.timerId = undefined;
            }, msDelayBetweenCalls);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) {
            return;
        }
        this.isLeftMouseButtonDownInsideDrawing = Tool.isMouseInsideDrawing;
        this.drawingElementsCopy = [...this.drawingService.svgElements];
        this.update();
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== MouseButton.Left || this.svgElementsDeletedDuringDrag.length === 0) {
            return;
        }
        const elementIndices = new Map<SVGGraphicsElement, number>();
        for (let i = 0; i < this.drawingElementsCopy.length; i++) {
            elementIndices.set(this.drawingElementsCopy[i], i);
        }
        this.svgElementsDeletedDuringDrag.sort((element1: ElementSiblingPair, element2: ElementSiblingPair) => {
            return (elementIndices.get(element2.element) as number) - (elementIndices.get(element1.element) as number);
        });

        this.commandService.addCommand(new RemoveElementsCommand(this.drawingService, this.svgElementsDeletedDuringDrag));
        this.svgElementsDeletedDuringDrag = [];
    }

    onEnter(event: MouseEvent): void {
        this.updateEraserRect();
    }

    update(): void {
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
                    sibling: this.drawingElementsCopy[elementIndex + 1],
                });
                this.drawingService.removeElement(this.svgElementUnderCursor);
            }
            this.svgElementUnderCursor = undefined;
        }
    }

    onToolSelection(): void {
        this.svgEraserElement = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgEraserElement, 'fill', '#fafafa');
        this.renderer.setAttribute(this.svgEraserElement, 'stroke', '#424242');
        this.renderer.setAttribute(this.svgEraserElement, 'stroke-width', '1');
        this.drawingService.addUiElement(this.svgEraserElement);
        this.updateEraserRect();
    }

    onToolDeselection(): void {
        this.drawingService.removeUiElement(this.svgEraserElement);
        this.restoreElementUnderCursorAttributes();
        this.svgElementUnderCursor = undefined;
    }

    private updateEraserRect(): void {
        this.eraserSize = this.settings.eraserSize!; // tslint:disable-line: no-non-null-assertion
        this.eraserRect = {
            x: Tool.mousePosition.x - this.eraserSize / 2,
            y: Tool.mousePosition.y - this.eraserSize / 2,
            width: this.eraserSize,
            height: this.eraserSize,
        };
        this.svgUtilityService.updateSvgRectFromRect(this.svgEraserElement, this.eraserRect);
    }

    private addRedBorderToElement(element: SVGGraphicsElement): void {
        const elementStrokeWidth = element.getAttribute('stroke-width') || undefined;
        const elementStrokeColor = element.getAttribute('stroke') || undefined;

        this.elementUnderCursorStrokeColor = elementStrokeColor === undefined ? 'none' : elementStrokeColor;
        this.elementUnderCursorStrokeWidth = elementStrokeWidth === undefined ? 'none' : elementStrokeWidth;

        let borderColor = 'rgb(255, 0, 0)';
        if (this.elementUnderCursorStrokeColor !== 'none') {
            const elementColor = Color.fromRgbaString(this.elementUnderCursorStrokeColor);
            const distanceFromRed = Math.sqrt(
                Math.pow(elementColor.red - Color.maxRgb, 2) + Math.pow(elementColor.green, 2) + Math.pow(elementColor.blue, 2)
            );
            const maxDistanceFromRed = 100;
            if (distanceFromRed <= maxDistanceFromRed) {
                borderColor = 'rgb(117, 30, 33)';
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
