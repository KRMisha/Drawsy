import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HistoryService } from '@app/drawing/services/history.service';
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

    private _svgElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name

    private elementClickUnlistenFunctionMap = new Map<SVGGraphicsElement, () => void>();

    private elementClickedSource = new Subject<SvgClickEvent>();

    // Disable member ordering lint error for public observables initialized after private subjects
    elementClicked$ = this.elementClickedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(rendererFactory: RendererFactory2, private historyService: HistoryService) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    addElement(element: SVGGraphicsElement): void {
        this._svgElements.push(element);
        if (this.svgDrawingContent !== undefined) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
        this.addElementClickListener(element);
    }

    addElementBefore(element: SVGGraphicsElement, elementAfter: SVGGraphicsElement): void {
        const insertionIndex = this._svgElements.indexOf(elementAfter);
        if (insertionIndex !== -1) {
            this._svgElements.splice(insertionIndex, 0, element);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.insertBefore(this.svgDrawingContent, element, elementAfter);
            }
            this.addElementClickListener(element);
        }
    }

    removeElement(element: SVGGraphicsElement): void {
        const elementToRemoveIndex = this._svgElements.indexOf(element);
        if (elementToRemoveIndex !== -1) {
            this._svgElements.splice(elementToRemoveIndex, 1);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.removeChild(this.svgDrawingContent, element);
            }
        }

        const unlistenFunction = this.elementClickUnlistenFunctionMap.get(element);
        if (unlistenFunction !== undefined) {
            unlistenFunction();
        }
        this.elementClickUnlistenFunctionMap.delete(element);
    }

    addUiElement(element: SVGGraphicsElement): void {
        if (this.svgUserInterfaceContent !== undefined) {
            this.renderer.appendChild(this.svgUserInterfaceContent, element);
        }
    }

    removeUiElement(element: SVGGraphicsElement): void {
        if (this.svgUserInterfaceContent !== undefined) {
            this.renderer.removeChild(this.svgUserInterfaceContent, element);
        }
    }

    reappendStoredElements(): void {
        for (const element of this._svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    clearStoredElements(): void {
        for (let i = this._svgElements.length - 1; i >= 0; i--) {
            this.removeElement(this._svgElements[i]);
        }
    }

    appendNewMatrixToElements(elements: SVGGraphicsElement[]): void {
        for (const element of elements) {
            element.transform.baseVal.appendItem(this.drawingRoot.createSVGTransform());
        }
    }

    isDrawingStarted(): boolean {
        return this._svgElements.length > 0;
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
        this.historyService.clearCommands();
        return true;
    }

    get svgElements(): SVGGraphicsElement[] {
        return this._svgElements;
    }

    private addElementClickListener(element: SVGGraphicsElement): void {
        const unlistenFunction = this.renderer.listen(element, 'mouseup', (event: MouseEvent) => {
            this.elementClickedSource.next({ mouseEvent: event, element } as SvgClickEvent);
        });
        this.elementClickUnlistenFunctionMap.set(element, unlistenFunction);
    }
}
