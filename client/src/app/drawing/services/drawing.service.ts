import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { SvgTransformations } from '@app/drawing/classes/svg-transformations';
import { Subject } from 'rxjs';
import { GeometryService } from './geometry.service';

const defaultDimensions: Vec2 = { x: 1300, y: 800 };

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private cachedCanvas?: HTMLCanvasElement = undefined;

    private mouseUpFunctionMap = new Map<SVGElement, () => void>();

    private transformationMap = new Map<SVGElement, SvgTransformations>();

    private _backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb); // tslint:disable-line: variable-name

    private elementClickedSource = new Subject<SvgClickEvent>();

    private _drawingRoot: SVGSVGElement; // tslint:disable-line: variable-name

    private _dimensions: Vec2 = defaultDimensions; // tslint:disable-line: variable-name

    readonly svgElements: SVGElement[] = []; // tslint:disable-line: variable-name

    elementClicked$ = this.elementClickedSource.asObservable();

    renderer: Renderer2;

    svgDrawingContent: SVGGElement;
    svgUserInterfaceContent: SVGGElement;

    title = 'Sans titre';
    labels: string[] = [];

    set backgroundColor(color: Color) {
        this._backgroundColor = color;
        this.cachedCanvas = undefined;
    }

    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    set drawingRoot(drawingRoot: SVGSVGElement) {
        this._drawingRoot = drawingRoot;
        const viewBoxString = `0 0 ${this.dimensions.x} ${this.dimensions.y}`;
        this.renderer.setAttribute(this.drawingRoot, 'viewBox', viewBoxString);
    }

    get drawingRoot(): SVGSVGElement {
        return this._drawingRoot;
    }

    set dimensions(dimensions: Vec2) {
        this._dimensions = dimensions;
        const viewBoxString = `0 0 ${this.dimensions.x} ${this.dimensions.y}`;
        this.renderer.setAttribute(this.drawingRoot, 'viewBox', viewBoxString);
    }

    get dimensions(): Vec2 {
        return this._dimensions;
    }

    addElement(element: SVGElement): void {
        this.svgElements.push(element);
        this.renderer.appendChild(this.svgDrawingContent, element);
        this.transformationMap.set(element, new SvgTransformations());

        const mouseUpFunction = this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ svgElement: element, mouseEvent: event });
        });

        this.mouseUpFunctionMap.set(element, mouseUpFunction);

        this.cachedCanvas = undefined;
    }

    removeElement(element: SVGElement): void {
        const elementToRemoveIndex = this.svgElements.indexOf(element);
        if (elementToRemoveIndex > -1) {
            this.svgElements.splice(elementToRemoveIndex, 1);
            this.renderer.removeChild(this.svgDrawingContent, element);
            this.transformationMap.delete(element);
        }

        const mouseUpFunction = this.mouseUpFunctionMap.get(element);
        if (mouseUpFunction) {
            mouseUpFunction();
        }
        this.mouseUpFunctionMap.delete(element);

        this.cachedCanvas = undefined;
    }

    addUiElement(element: SVGElement): void {
        this.renderer.appendChild(this.svgUserInterfaceContent, element);
    }

    removeUiElement(element: SVGElement): void {
        this.renderer.removeChild(this.svgUserInterfaceContent, element);
    }

    reappendStoredElements(): void {
        for (const element of this.svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
        this.cachedCanvas = undefined;
    }

    clearStoredElements(): void {
        while (this.svgElements.length > 0) {
            this.removeElement(this.svgElements[0]);
        }
    }

    async getCanvasFromSvgRoot(root: SVGSVGElement): Promise<HTMLCanvasElement> {
        if (this.cachedCanvas !== undefined) {
            return this.cachedCanvas;
        }

        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setAttribute(canvas, 'width', root.viewBox.baseVal.width.toString());
        this.renderer.setAttribute(canvas, 'height', root.viewBox.baseVal.height.toString());

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const image = await this.getImageFromSvgRoot(root);
        context.drawImage(image, 0, 0);
        this.cachedCanvas = canvas;
        return canvas;
    }

    getElementsUnderPoint(point: Vec2): SVGElement[] {
        return this.getElementsUnderArea({ x: point.x, y: point.y, width: 0, height: 0 });
    }

    getElementsUnderArea(area: Rect): SVGElement[] {
        return this.svgElements.filter((element: SVGElement) => GeometryService.areRectsIntersecting(area, this.getElementBounds(element)));
    }

    isDrawingStarted(): boolean {
        return this.svgElements.length > 0;
    }

    getElementBounds(element: SVGElement): Rect {
        const svgElementBounds = element.getBoundingClientRect() as DOMRect;
        const drawingRootBounds = this.drawingRoot.getBoundingClientRect() as DOMRect;

        const paddingStr = element.getAttribute('shape-padding') as string;
        const paddingValue = paddingStr === null ? 0 : +paddingStr;

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

    updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }

    moveElementList(elements: SVGElement[], moveOffset: Vec2): void {
        for (const element of elements) {
            const transformations = this.transformationMap.get(element);
            if (!transformations) {
                continue;
            }
            transformations.translation.x += moveOffset.x;
            transformations.translation.y += moveOffset.y;
            this.renderer.setAttribute(element, 'transform', transformations.toString());
        }
        this.cachedCanvas = undefined;
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
