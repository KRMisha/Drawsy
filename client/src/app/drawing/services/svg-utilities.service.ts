import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from './drawing.service';
import { GeometryService } from './geometry.service';

@Injectable({
    providedIn: 'root',
})
export class SvgUtilitiesService {
    renderer: Renderer2;
    drawingRoot: SVGSVGElement;

    constructor(private drawingService: DrawingService) {}

    getElementsUnderPoint(svgElements: SVGElement[], point: Vec2): SVGElement[] {
        return this.getElementsUnderArea(svgElements, { x: point.x, y: point.y, width: 0, height: 0 });
    }

    getElementsUnderArea(svgElements: SVGElement[], area: Rect): SVGElement[] {
        return svgElements.filter((element: SVGElement) => GeometryService.areRectsIntersecting(area, this.getElementBounds(element)));
    }

    getElementUnderAreaPixelPerfect(svgElements: SVGElement[], area: Rect): SVGElement | undefined {
        const drawingRect = this.drawingRoot.getBoundingClientRect() as DOMRect;

        const elementIndices = new Map<SVGElement, number>();
        for (let i = 0; i < this.drawingService.svgElements.length; i++) {
            elementIndices.set(this.drawingService.svgElements[i], i);
        }

        const availableElementsSet = new Set<SVGElement>();
        for (const element of svgElements) {
            availableElementsSet.add(element);
        }

        let topMostElement: SVGElement | undefined;
        let topMostElementIndex = 0;

        const samplingRatio = 0.1;
        const stepSize: Vec2 = {
            x: Math.round(Math.max(1, area.width * samplingRatio)),
            y: Math.round(Math.max(1, area.height * samplingRatio)),
        };
        const startIndexLoop: Vec2 = { x: Math.round((area.width % stepSize.x) / 2), y: Math.round((area.height % stepSize.y) / 2) };

        for (let i = startIndexLoop.x; i < area.width + stepSize.x; i += stepSize.x) {
            for (let j = startIndexLoop.y; j < area.height + stepSize.y; j += stepSize.y) {
                const x = drawingRect.x + area.x + i;
                const y = drawingRect.y + area.y + j;
                const elementUnderPoint = (document.elementFromPoint(x, y) || undefined) as SVGElement;
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
        const drawingRootBounds = this.drawingRoot.getBoundingClientRect() as DOMRect;

        const paddingString = element.getAttribute('shape-padding') as string;
        const paddingValue = paddingString === null ? 0 : +paddingString;

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

    async getCanvasFromSvgRoot(root: SVGSVGElement): Promise<HTMLCanvasElement> {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setAttribute(canvas, 'width', root.viewBox.baseVal.width.toString());
        this.renderer.setAttribute(canvas, 'height', root.viewBox.baseVal.height.toString());

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const image = await this.getImageFromSvgRoot(root);
        context.drawImage(image, 0, 0);
        return canvas;
    }

    private async getImageFromSvgRoot(root: SVGSVGElement): Promise<HTMLImageElement> {
        const svg64 = btoa(root.outerHTML);
        const image = new Image();
        return new Promise<HTMLImageElement>((resolve: (image: HTMLImageElement) => void): void => {
            image.onload = () => {
                resolve(image);
            };
            image.src = 'data:image/svg+xml;base64,' + svg64;
        });
    }
}
