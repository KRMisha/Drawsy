import { Injectable, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { SvgTransformations } from '@app/drawing/classes/svg-transformations';
import { Subject } from 'rxjs';

const defaultDimensions: Vec2 = { x: 1300, y: 800 };

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private mouseUpFunctionMap = new Map<SVGElement, () => void>();

    private transformationMap = new Map<SVGElement, SvgTransformations>();

    private _backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb); // tslint:disable-line: variable-name

    private elementClickedSource = new Subject<SvgClickEvent>();

    readonly svgElements: SVGElement[] = []; // tslint:disable-line: variable-name

    elementClicked$ = this.elementClickedSource.asObservable();

    renderer: Renderer2;

    drawingRoot: SVGSVGElement;
    svgDrawingContent: SVGGElement;
    svgUserInterfaceContent: SVGGElement;

    dimensions: Vec2 = defaultDimensions;

    title = 'Sans titre';
    labels: string[] = [];
    drawingId = '';

    set backgroundColor(color: Color) {
        this._backgroundColor = color;
    }

    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    addElement(element: SVGElement, elementNextNeighbour?: SVGElement): void {
        if (elementNextNeighbour === undefined) {
            this.svgElements.push(element);
            this.renderer.appendChild(this.svgDrawingContent, element);
        } else {
            this.svgElements.splice(this.svgElements.indexOf(elementNextNeighbour), 0, element);
            this.renderer.insertBefore(this.svgDrawingContent, element, elementNextNeighbour);
        }
        this.transformationMap.set(element, new SvgTransformations());

        const mouseUpFunction = this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ svgElement: element, mouseEvent: event });
        });

        this.mouseUpFunctionMap.set(element, mouseUpFunction);
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
    }

    clearStoredElements(): void {
        while (this.svgElements.length > 0) {
            this.removeElement(this.svgElements[0]);
        }
    }

    isDrawingStarted(): boolean {
        return this.svgElements.length > 0;
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
    }
}
