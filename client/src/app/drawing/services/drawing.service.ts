import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { Subject } from 'rxjs';
import { GeometryService } from './geometry.service';

const defaultDimensions: Vec2 = { x: 1024, y: 1024 };

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private elementClickedSource = new Subject<SvgClickEvent>();
    private elementHoveredSource = new Subject<SVGElement>();

    elementClicked$ = this.elementClickedSource.asObservable();
    elementHovered$ = this.elementHoveredSource.asObservable();

    renderer: Renderer2;

    drawingRoot: SVGSVGElement;
    svgDrawingContent: SVGGElement;
    svgUserInterfaceContent: SVGGElement;

    title = 'Sans titre';
    labels: string[] = [];
    dimensions: Vec2 = defaultDimensions;
    backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    private _svgElements: SVGElement[] = []; // tslint:disable-line: variable-name
    get svgElements(): SVGElement[] {
        return this._svgElements;
    }

    addElement(element: SVGElement): void {
        this.svgElements.push(element);
        this.renderer.appendChild(this.svgDrawingContent, element);

        this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ svgElement: element, mouseEvent: event });
        });
        this.renderer.listen(element, 'mousemove', (event: MouseEvent) => {
            this.elementHoveredSource.next(element);
        });
    }

    removeElement(element: SVGElement): void {
        const elementToRemoveIndex = this.svgElements.indexOf(element);
        if (elementToRemoveIndex > -1) {
            this.svgElements.splice(elementToRemoveIndex, 1);
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
    }

    addUiElement(element: SVGElement): void {
        this.renderer.appendChild(this.svgUserInterfaceContent, element);
    }

    removeUiElement(element: SVGElement): void {
        this.renderer.removeChild(this.svgUserInterfaceContent, element);
    }

    reappendStoredElements(): void {
        for (const element of this.svgElements) {
            this.addElement(element);
        }
    }

    clearStoredElements(): void {
        for (const element of this.svgElements) {
            this.renderer.removeChild(this.svgDrawingContent, element);
        }
    }

    async getImageFromSvgRoot(root: SVGSVGElement): Promise<HTMLImageElement> {
        const svg64 = btoa(root.outerHTML);
        const image = new Image();
        image.src = 'data:image/svg+xml;base64,' + svg64;
        return new Promise<HTMLImageElement>((resolve: (image: HTMLImageElement) => void): void => {
            image.onload = () => {
                resolve(image);
            };
        });
    }

    async getCanvasFromSvgRoot(root: SVGSVGElement): Promise<HTMLCanvasElement> {
        const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
        this.renderer.setAttribute(canvas, 'width', this.dimensions.x.toString());
        this.renderer.setAttribute(canvas, 'height', this.dimensions.y.toString());

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        return new Promise<HTMLCanvasElement>((resolve: (canvas: HTMLCanvasElement) => void) => {
            this.getImageFromSvgRoot(root).then((image: HTMLImageElement) => {
                context.drawImage(image, 0, 0);
                resolve(canvas);
            });
        });
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

        return {
            x: svgElementBounds.x - drawingRootBounds.x,
            y: svgElementBounds.y - drawingRootBounds.y,
            width: svgElementBounds.width,
            height: svgElementBounds.height,
        } as Rect;
    }

    getElementListBounds(elements: SVGElement[]): Rect | null {
        if (elements.length === 0) {
            return null;
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
}
