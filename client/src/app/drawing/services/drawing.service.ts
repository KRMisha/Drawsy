import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { SvgTransformations } from '@app/drawing/classes/svg-transformations';
import { CommandService } from '@app/drawing/services/command.service';
import { Subject } from 'rxjs';

const defaultDimensions: Vec2 = { x: 1300, y: 800 };
const defaultTitle = 'Sans titre';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    drawingRoot: SVGSVGElement;
    svgDrawingContent: SVGGElement;
    svgUserInterfaceContent: SVGGElement;

    dimensions: Vec2 = defaultDimensions;
    backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    id?: string;
    title = defaultTitle;
    labels: string[] = [];

    private renderer: Renderer2;

    private mouseUpFunctionMap = new Map<SVGElement, () => void>();
    private transformationMap = new Map<SVGElement, SvgTransformations>();

    private _svgElements: SVGElement[] = []; // tslint:disable-line: variable-name

    private elementClickedSource = new Subject<SvgClickEvent>();

    elementClicked$ = this.elementClickedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(private rendererFactory: RendererFactory2, private commandService: CommandService) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    get svgElements(): SVGElement[] {
        return this._svgElements;
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
            this.elementClickedSource.next({ element, mouseEvent: event });
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

    confirmNewDrawing(dimensions: Vec2, backgroundColor: Color): boolean {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous continuer et abandonner vos changements?';
        if (this.isDrawingStarted() && !confirm(confirmationMessage)) {
            return false;
        }

        this.dimensions = dimensions;
        this.backgroundColor = backgroundColor;

        this.id = undefined;
        this.title = defaultTitle;
        this.labels = [];

        this.clearStoredElements();
        this.commandService.clearCommands();
        return true;
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
