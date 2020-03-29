import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgTransformations } from '@app/drawing/classes/svg-transformations';
import { CommandService } from '@app/drawing/services/command.service';
import { Color } from '@app/shared/classes/color';
import { SvgClickEvent } from '@app/shared/classes/svg-click-event';
import { Vec2 } from '@app/shared/classes/vec2';
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

    private transformationMap = new Map<SVGGraphicsElement, SvgTransformations>();
    private mouseUpUnlistenFunctionMap = new Map<SVGGraphicsElement, () => void>();

    private _svgElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name

    private elementClickedSource = new Subject<SvgClickEvent>();

    elementClicked$ = this.elementClickedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(rendererFactory: RendererFactory2, private commandService: CommandService) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    addElement(element: SVGGraphicsElement, elementNextNeighbor?: SVGGraphicsElement): void {
        if (elementNextNeighbor === undefined) {
            this.svgElements.push(element);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.appendChild(this.svgDrawingContent, element);
            }
        } else {
            const elementToRemoveIndex = this.svgElements.indexOf(elementNextNeighbor);
            if (elementToRemoveIndex !== -1) {
                this.svgElements.splice(elementToRemoveIndex, 0, element);
                if (this.svgDrawingContent !== undefined) {
                    this.renderer.insertBefore(this.svgDrawingContent, element, elementNextNeighbor);
                }
            }
        }
        this.transformationMap.set(element, new SvgTransformations());

        const mouseUpUnlistenFunction = this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ element, mouseEvent: event });
        });
        this.mouseUpUnlistenFunctionMap.set(element, mouseUpUnlistenFunction);
    }

    removeElement(element: SVGGraphicsElement): void {
        const elementToRemoveIndex = this.svgElements.indexOf(element);
        if (elementToRemoveIndex !== -1) {
            this.svgElements.splice(elementToRemoveIndex, 1);
            this.transformationMap.delete(element);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.removeChild(this.svgDrawingContent, element);
            }
        }

        const mouseUpUnlistenFunction = this.mouseUpUnlistenFunctionMap.get(element);
        if (mouseUpUnlistenFunction !== undefined) {
            mouseUpUnlistenFunction();
        }
        this.mouseUpUnlistenFunctionMap.delete(element);
    }

    addUiElement(element: SVGGraphicsElement): void {
        if (this.svgDrawingContent !== undefined) {
            this.renderer.appendChild(this.svgUserInterfaceContent, element);
        }
    }

    removeUiElement(element: SVGGraphicsElement): void {
        if (this.svgDrawingContent !== undefined) {
            this.renderer.removeChild(this.svgUserInterfaceContent, element);
        }
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

    moveElementList(elements: SVGGraphicsElement[], moveOffset: Vec2): void {
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

    get svgElements(): SVGGraphicsElement[] {
        return this._svgElements;
    }
}
