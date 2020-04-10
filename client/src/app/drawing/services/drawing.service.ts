import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingLoadOptions } from '@app/drawing/classes/drawing-load-options';
import { Color } from '@app/shared/classes/color';
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

    private drawingLoadedSource = new Subject<void>();

    // Disable member ordering lint error for public observables initialized after private subjects
    drawingLoaded$ = this.drawingLoadedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    addElement(element: SVGGraphicsElement): void {
        this._svgElements.push(element);
        if (this.svgDrawingContent !== undefined) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    addElementBefore(element: SVGGraphicsElement, elementAfter: SVGGraphicsElement): void {
        const insertionIndex = this._svgElements.indexOf(elementAfter);
        if (insertionIndex !== -1) {
            this._svgElements.splice(insertionIndex, 0, element);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.insertBefore(this.svgDrawingContent, element, elementAfter);
            }
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
    }

    reappendStoredElements(): void {
        for (const element of this._svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
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

    isDrawingStarted(): boolean {
        return this._svgElements.length > 0;
    }

    loadDrawing(drawingLoadOptions: DrawingLoadOptions): boolean {
        if (!this.clearElementsWithConfirmation()) {
            return false;
        }

        this.dimensions = drawingLoadOptions.dimensions;
        this.backgroundColor = drawingLoadOptions.backgroundColor;

        const drawingData = drawingLoadOptions.drawingData;
        if (drawingData !== undefined) {
            this.id = drawingData.id;
            this.title = drawingData.title;
            this.labels = drawingData.labels;

            for (const element of drawingData.elements) {
                this.addElement(element);
            }
        } else {
            this.id = undefined;
            this.title = defaultTitle;
            this.labels = [];
        }

        this.drawingLoadedSource.next();

        return true;
    }

    findDrawingChildElement(element: EventTarget | null): SVGGraphicsElement | undefined {
        while (element instanceof SVGGraphicsElement && element.parentNode !== null) {
            if (element.parentNode === this.svgDrawingContent) {
                return element;
            } else {
                element = element.parentNode;
            }
        }

        return undefined;
    }

    get svgElements(): SVGGraphicsElement[] {
        return this._svgElements;
    }

    private clearElementsWithConfirmation(): boolean {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous continuer et abandonner vos changements?';
        if (this.isDrawingStarted() && !confirm(confirmationMessage)) {
            return false;
        }

        this.clearElements();
        return true;
    }

    private clearElements(): void {
        for (let i = this._svgElements.length - 1; i >= 0; i--) {
            this.removeElement(this._svgElements[i]);
        }
    }
}
