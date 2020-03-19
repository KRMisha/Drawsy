import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';

@Injectable({
    providedIn: 'root',
})
export class SvgUtilityService {
    private renderer: Renderer2;

    constructor(private rendererFactory: RendererFactory2, private drawingService: DrawingService) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    getElementsUnderPoint(elements: SVGElement[], point: Vec2): SVGElement[] {
        return this.getElementsUnderArea(elements, { x: point.x, y: point.y, width: 0, height: 0 });
    }

    getElementsUnderArea(elements: SVGElement[], area: Rect): SVGElement[] {
        return elements.filter((element: SVGElement) => GeometryService.areRectsIntersecting(area, this.getElementBounds(element)));
    }

    // tslint:disable-next-line: cyclomatic-complexity
    getElementUnderAreaPixelPerfect(elements: SVGElement[], area: Rect): SVGElement | undefined {
        const drawingRect = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;

        const elementIndices = new Map<SVGElement, number>();
        for (let i = 0; i < this.drawingService.svgElements.length; i++) {
            elementIndices.set(this.drawingService.svgElements[i], i);
        }

        const availableElementsSet = new Set<SVGElement>(elements);

        let topMostElement: SVGElement | undefined;
        let topMostElementIndex = 0;

        for (let i = 0; i < area.width; i++) {
            for (let j = 0; j < area.height; j++) {
                const x = drawingRect.x + area.x + i;
                const y = drawingRect.y + area.y + j;

                // Function does not exist in Renderer2
                let elementUnderPoint = (document.elementFromPoint(x, y) || undefined) as SVGElement;

                if (elementUnderPoint !== undefined && elementUnderPoint.parentElement instanceof SVGElement) {
                    const parentElement = (elementUnderPoint.parentElement || undefined) as SVGElement;
                    if (parentElement !== undefined && availableElementsSet.has(parentElement as SVGElement)) {
                        elementUnderPoint = parentElement;
                    }
                }

                if (
                    elementUnderPoint === undefined ||
                    !elementIndices.has(elementUnderPoint) ||
                    !availableElementsSet.has(elementUnderPoint)
                ) {
                    continue;
                }

                const elementUnderPointIndex = elementIndices.get(elementUnderPoint) as number;
                if (topMostElement === undefined || elementUnderPointIndex > topMostElementIndex) {
                    topMostElement = elementUnderPoint;
                    topMostElementIndex = elementUnderPointIndex;
                }
            }
        }

        return topMostElement;
    }

    updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }

    getElementBounds(element: SVGElement): Rect {
        const svgElementBounds = element.getBoundingClientRect() as DOMRect;
        const drawingRootBounds = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;

        const paddingString = element.getAttribute('padding') || undefined;
        const paddingValue = paddingString === undefined ? 0 : +paddingString;

        return {
            x: svgElementBounds.x - drawingRootBounds.x - paddingValue,
            y: svgElementBounds.y - drawingRootBounds.y - paddingValue,
            width: svgElementBounds.width + 2 * paddingValue,
            height: svgElementBounds.height + 2 * paddingValue,
        } as Rect;
    }

    getElementListBounds(elements: SVGElement[]): Rect | undefined {
        if (elements.length === 0) {
            return undefined;
        }

        const firstShapeBounds = this.getElementBounds(elements[0]);
        const minPos = { x: firstShapeBounds.x, y: firstShapeBounds.y };
        const maxPos = { x: firstShapeBounds.x + firstShapeBounds.width, y: firstShapeBounds.y + firstShapeBounds.height };

        for (const element of elements) {
            const currentShapeBounds = this.getElementBounds(element);
            minPos.x = Math.min(minPos.x, currentShapeBounds.x);
            minPos.y = Math.min(minPos.y, currentShapeBounds.y);
            maxPos.x = Math.max(maxPos.x, currentShapeBounds.x + currentShapeBounds.width);
            maxPos.y = Math.max(maxPos.y, currentShapeBounds.y + currentShapeBounds.height);
        }
        return { x: minPos.x, y: minPos.y, width: maxPos.x - minPos.x, height: maxPos.y - minPos.y } as Rect;
    }

    createDashedRectBorder(color: Color): SVGRectElement {
        const svgRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(svgRect, 'fill', `rgba(${color.red}, ${color.green}, ${color.blue}, 0.2)`);
        this.renderer.setAttribute(svgRect, 'stroke-dasharray', '1, 7');
        this.renderer.setAttribute(svgRect, 'stroke-width', '4');
        this.renderer.setAttribute(svgRect, 'stroke-linecap', 'round');
        this.renderer.setAttribute(svgRect, 'stroke', `rgba(${color.red}, ${color.green}, ${color.blue}, 0.8)`);
        return svgRect;
    }

    async getCanvasFromSvgRoot(drawingRoot: SVGSVGElement): Promise<HTMLCanvasElement> {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setAttribute(canvas, 'width', drawingRoot.viewBox.baseVal.width.toString());
        this.renderer.setAttribute(canvas, 'height', drawingRoot.viewBox.baseVal.height.toString());

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const image = await this.getImageFromSvgRoot(drawingRoot);
        context.drawImage(image, 0, 0);
        return canvas;
    }

    private async getImageFromSvgRoot(drawingRoot: SVGSVGElement): Promise<HTMLImageElement> {
        const svg64 = btoa(drawingRoot.outerHTML);
        const image = new Image();
        return new Promise<HTMLImageElement>((resolve: (image: HTMLImageElement) => void): void => {
            image.onload = () => {
                resolve(image);
            };
            image.src = 'data:image/svg+xml;base64,' + svg64;
        });
    }
}
