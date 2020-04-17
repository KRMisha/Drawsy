import { ApplicationRef, Injectable, RendererFactory2 } from '@angular/core';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEraserService extends Tool {
    private svgEraserRect: SVGRectElement;
    private eraserRect: Rect;

    private elementUnderCursor?: SVGGraphicsElement;
    private elementUnderCursorClone?: SVGGraphicsElement;

    private isErasing = false;
    private initialDrawingElements: SVGGraphicsElement[] = [];
    private elementsDeletedDuringDrag: ElementSiblingPair[] = [];

    private timerId?: number;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        private applicationRef: ApplicationRef
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Eraser);
        this.settings.eraserSize = ToolDefaults.defaultEraserSize;

        this.svgEraserRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgEraserRect, 'fill', 'rgb(255, 255, 255)');
        this.renderer.setAttribute(this.svgEraserRect, 'stroke-width', '1');
        this.renderer.addClass(this.svgEraserRect, 'theme-eraser');
    }

    onMouseMove(event: MouseEvent): void {
        const msDelayBetweenCalls = 16;
        this.updateEraserRect();
        if (this.timerId === undefined) {
            this.timerId = window.setTimeout(() => {
                this.update(false);
                this.timerId = undefined;
            }, msDelayBetweenCalls);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!Tool.isMouseInsideDrawing || event.button !== MouseButton.Left) {
            return;
        }

        this.isErasing = true;
        this.initialDrawingElements = [...this.drawingService.elements];
        this.update(false);
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopErasing();
        }
    }

    onToolSelection(): void {
        this.drawingService.addUiElement(this.svgEraserRect);
        this.updateEraserRect();
        this.update(false);
    }

    onToolDeselection(): void {
        this.reset();
    }

    onHistoryChange(): void {
        this.applicationRef.tick();
        this.update(true);
    }

    private updateEraserRect(): void {
        // tslint:disable: no-non-null-assertion
        this.eraserRect = {
            x: Tool.mousePosition.x - this.settings.eraserSize! / 2,
            y: Tool.mousePosition.y - this.settings.eraserSize! / 2,
            width: this.settings.eraserSize!,
            height: this.settings.eraserSize!,
        };
        // tslint:enable: no-non-null-assertion

        this.renderer.setAttribute(this.svgEraserRect, 'x', this.eraserRect.x.toString());
        this.renderer.setAttribute(this.svgEraserRect, 'y', this.eraserRect.y.toString());
        this.renderer.setAttribute(this.svgEraserRect, 'width', this.eraserRect.width.toString());
        this.renderer.setAttribute(this.svgEraserRect, 'height', this.eraserRect.height.toString());
    }

    private update(mustRerenderRedElementClone: boolean): void {
        const hoveredElement = this.getElementUnderAreaPixelPerfect(this.eraserRect);

        if (hoveredElement === undefined) {
            this.hideRedElementClone();
            this.elementUnderCursor = undefined;
            return;
        }

        if (hoveredElement !== this.elementUnderCursor || mustRerenderRedElementClone) {
            this.hideRedElementClone();
            this.elementUnderCursor = hoveredElement;
            this.showRedElementClone();
        }

        if (this.elementUnderCursor !== undefined && this.isErasing) {
            const elementIndex = this.initialDrawingElements.indexOf(this.elementUnderCursor);
            if (elementIndex !== -1) {
                this.elementsDeletedDuringDrag.push({
                    element: this.elementUnderCursor,
                    sibling: this.initialDrawingElements[elementIndex + 1],
                });
                this.drawingService.removeElement(this.elementUnderCursor);
            }
            this.hideRedElementClone();
            this.elementUnderCursor = undefined;
        }
    }

    private getElementUnderAreaPixelPerfect(area: Rect): SVGGraphicsElement | undefined {
        const drawingRect = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;

        let topmostElement: SVGGraphicsElement | undefined;
        for (let i = 0; i < area.width; i++) {
            for (let j = 0; j < area.height; j++) {
                // Function does not exist in Renderer2
                const elementUnderPoint = this.drawingService.findDrawingChildElement(
                    document.elementFromPoint(drawingRect.x + area.x + i, drawingRect.y + area.y + j)
                );

                if (elementUnderPoint !== undefined && elementUnderPoint !== topmostElement) {
                    // API requires use of bit mask
                    // tslint:disable: no-bitwise
                    const isElementAboveTopmostElement =
                        topmostElement === undefined ||
                        elementUnderPoint.compareDocumentPosition(topmostElement) & Node.DOCUMENT_POSITION_PRECEDING;
                    // tslint:enable: no-bitwise
                    if (isElementAboveTopmostElement) {
                        topmostElement = elementUnderPoint;
                    }
                }
            }
        }

        return topmostElement;
    }

    private showRedElementClone(): void {
        if (this.elementUnderCursor === undefined) {
            return;
        }

        const elementStrokeColor = this.elementUnderCursor.getAttribute('stroke') ?? 'none';
        const elementStrokeWidth = this.elementUnderCursor.getAttribute('stroke-width') ?? 'none';

        let borderColor = 'rgb(255, 0, 0)';
        if (elementStrokeColor !== 'none') {
            const elementColor = Color.fromRgbaString(elementStrokeColor);
            const distanceFromRed = Math.sqrt((elementColor.red - Color.maxRgb) ** 2 + elementColor.green ** 2 + elementColor.blue ** 2);
            const maxDistanceFromRed = 100;
            if (distanceFromRed <= maxDistanceFromRed) {
                borderColor = 'rgb(117, 30, 33)';
            }
        }

        const minimumBorderWidth = 3;
        const borderIncreaseFactor = 1.08;
        const borderWidth = minimumBorderWidth + (elementStrokeWidth === 'none' ? 0 : +elementStrokeWidth * borderIncreaseFactor);

        this.elementUnderCursorClone = this.elementUnderCursor.cloneNode(true) as SVGGraphicsElement;
        this.renderer.setAttribute(this.elementUnderCursorClone, 'stroke', borderColor);
        this.renderer.setAttribute(this.elementUnderCursorClone, 'stroke-width', borderWidth.toString());
        this.drawingService.addUiElementBefore(this.elementUnderCursorClone, this.svgEraserRect);
    }

    private hideRedElementClone(): void {
        if (this.elementUnderCursorClone !== undefined) {
            this.drawingService.removeUiElement(this.elementUnderCursorClone);
            this.elementUnderCursorClone = undefined;
        }
    }

    private stopErasing(): void {
        this.isErasing = false;

        if (this.elementsDeletedDuringDrag.length === 0) {
            return;
        }

        const elementIndices = new Map<SVGGraphicsElement, number>(
            this.initialDrawingElements.map((element: SVGGraphicsElement, index: number) => [element, index])
        );
        this.elementsDeletedDuringDrag.sort((element1: ElementSiblingPair, element2: ElementSiblingPair) => {
            // Map will always have indices for elements since their insertion is guaranteed just prior
            // tslint:disable-next-line: no-non-null-assertion
            return elementIndices.get(element2.element)! - elementIndices.get(element1.element)!;
        });

        this.historyService.addCommand(new RemoveElementsCommand(this.drawingService, this.elementsDeletedDuringDrag));
        this.elementsDeletedDuringDrag = [];
    }

    private reset(): void {
        this.drawingService.removeUiElement(this.svgEraserRect);
        this.hideRedElementClone();
        this.elementUnderCursor = undefined;

        this.stopErasing();

        window.clearTimeout(this.timerId);
        this.timerId = undefined;
    }
}
