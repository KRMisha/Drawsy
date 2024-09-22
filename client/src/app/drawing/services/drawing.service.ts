import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingLoadOptions } from '@app/drawing/classes/drawing-load-options';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import ZoomInfo from '@app/tools/constants/zoom-info';
import { Subject } from 'rxjs';

const defaultDimensions: Vec2 = { x: 1300, y: 800 };
const defaultTitle = 'Sans titre';
const localStorageDrawingAutosaveContentKey = 'drawingAutosaveContent';
const localStorageDrawingAutosaveIdKey = 'drawingAutosaveId';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    drawingContainer: ElementRef<HTMLDivElement>;
    drawingRoot: SVGSVGElement;
    svgDrawingContent: SVGGElement;
    svgUserInterfaceContent: SVGGElement;

    private renderer: Renderer2;

    // tslint:disable: variable-name
    private _id?: string;
    private _title = defaultTitle;
    private _labels: string[] = [];

    private _dimensions: Vec2 = defaultDimensions;
    private _backgroundColor: Color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    private _elements: SVGGraphicsElement[] = [];

    private _zoomPercentage = ZoomInfo.defaultZoomPercentage;
    private _translation: Vec2 = { x: 0, y: 0 };
    // tslint:enable: variable-name

    private drawingLoadedSource = new Subject<void>();
    private forceDetectChangesSource = new Subject<void>();
    private zoomPercentChangedSource = new Subject<void>();
    private translationChangedSource = new Subject<void>();

    // Disable member ordering lint error for public observables initialized after private subjects
    // tslint:disable: member-ordering
    drawingLoaded$ = this.drawingLoadedSource.asObservable();
    forceDetectChanges$ = this.forceDetectChangesSource.asObservable();
    zoomPercentChangedSubscription$ = this.zoomPercentChangedSource.asObservable();
    translationChanged$ = this.translationChangedSource.asObservable();
    // tslint:enable: member-ordering

    constructor(
        rendererFactory: RendererFactory2,
        private drawingSerializerService: DrawingSerializerService,
        private snackbarService: SnackbarService
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);

        this.loadDrawingFromStorage();
    }

    addElement(element: SVGGraphicsElement): void {
        this._elements.push(element);
        if (this.svgDrawingContent !== undefined) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    addElementBefore(element: SVGGraphicsElement, elementAfter: SVGGraphicsElement): void {
        const insertionIndex = this._elements.indexOf(elementAfter);
        if (insertionIndex !== -1) {
            this._elements.splice(insertionIndex, 0, element);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.insertBefore(this.svgDrawingContent, element, elementAfter);
            }
        }
    }

    removeElement(element: SVGGraphicsElement): void {
        const elementToRemoveIndex = this._elements.indexOf(element);
        if (elementToRemoveIndex !== -1) {
            this._elements.splice(elementToRemoveIndex, 1);
            if (this.svgDrawingContent !== undefined) {
                this.renderer.removeChild(this.svgDrawingContent, element);
            }
        }
    }

    reappendStoredElements(): void {
        for (const element of this._elements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    addUiElement(element: SVGGraphicsElement): void {
        if (this.svgUserInterfaceContent !== undefined) {
            this.renderer.appendChild(this.svgUserInterfaceContent, element);
        }
    }

    addUiElementBefore(element: SVGGraphicsElement, elementAfter: SVGGraphicsElement): void {
        if (this.svgUserInterfaceContent !== undefined) {
            this.renderer.insertBefore(this.svgUserInterfaceContent, element, elementAfter);
        }
    }

    removeUiElement(element: SVGGraphicsElement): void {
        if (this.svgUserInterfaceContent !== undefined) {
            this.renderer.removeChild(this.svgUserInterfaceContent, element);
        }
    }

    showUiElements(): void {
        this.renderer.removeStyle(this.svgUserInterfaceContent, 'display');
    }

    hideUiElements(): void {
        this.renderer.setStyle(this.svgUserInterfaceContent, 'display', 'none');
    }

    isDrawingStarted(): boolean {
        return localStorage.getItem(localStorageDrawingAutosaveContentKey) !== null;
    }

    loadDrawingWithConfirmation(drawingLoadOptions: DrawingLoadOptions): boolean {
        const confirmationMessage =
            'Attention! Un dessin non-vide est déjà présent sur la zone de travail. ' +
            'Désirez-vous continuer et abandonner vos changements?';
        if (this._elements.length > 0 && !confirm(confirmationMessage)) {
            return false;
        }

        this.loadDrawing(drawingLoadOptions);
        return true;
    }

    loadDrawingFromStorage(): void {
        const serializedDrawing = localStorage.getItem(localStorageDrawingAutosaveContentKey);
        if (serializedDrawing === null) {
            return;
        }

        const id = localStorage.getItem(localStorageDrawingAutosaveIdKey) ?? undefined;

        const svgFileContainer = this.drawingSerializerService.deserializeDrawing(serializedDrawing, id);
        const drawingLoadOptions = this.drawingSerializerService.getDrawingLoadOptions(svgFileContainer);
        this.loadDrawing(drawingLoadOptions);
    }

    saveDrawingToStorage(): void {
        if (this.drawingRoot === undefined) {
            return;
        }

        this.forceDetectChangesSource.next();

        const titleElement = this.drawingRoot.getElementsByTagName('title')[0];
        titleElement.innerHTML = this._title;

        const serializedDrawing = this.drawingSerializerService.serializeDrawing(this.drawingRoot);

        try {
            localStorage.setItem(localStorageDrawingAutosaveContentKey, serializedDrawing);
        } catch (error) {
            this.snackbarService.displayMessage("La sauvegarde automatique a échoué puisque l'espace maximal pour un dessin a été dépassé");
        }

        titleElement.innerHTML = '';

        if (this._id !== undefined) {
            localStorage.setItem(localStorageDrawingAutosaveIdKey, this._id);
        } else {
            localStorage.removeItem(localStorageDrawingAutosaveIdKey);
        }
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

    zoomIn(): void {
        this.zoomPercentage = Math.min(this._zoomPercentage + ZoomInfo.zoomPercentageIncrement, ZoomInfo.maximumZoomPercentage);
    }

    zoomOut(): void {
        this.zoomPercentage = Math.max(this._zoomPercentage - ZoomInfo.zoomPercentageIncrement, ZoomInfo.minimumZoomPercentage);
    }

    resetCanvasView(): void {
        this.zoomPercentage = ZoomInfo.defaultZoomPercentage;
        this.translation = { x: 0, y: 0 };
    }

    get id(): string | undefined {
        return this._id;
    }

    set id(id: string | undefined) {
        this._id = id;
        this.saveDrawingToStorage();
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
        this.saveDrawingToStorage();
    }

    get labels(): string[] {
        return this._labels;
    }

    set labels(labels: string[]) {
        this._labels = labels;
        this.saveDrawingToStorage();
    }

    get dimensions(): Vec2 {
        return this._dimensions;
    }

    set dimensions(dimensions: Vec2) {
        this._dimensions = dimensions;
        this.saveDrawingToStorage();
    }

    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    set backgroundColor(color: Color) {
        this._backgroundColor = color;
        this.saveDrawingToStorage();
    }

    get elements(): SVGGraphicsElement[] {
        return this._elements;
    }

    get translation(): Vec2 {
        return this._translation;
    }

    set translation(translation: Vec2) {
        this._translation = translation;
        this.drawingContainer.nativeElement.setAttribute('style', `transform: translate(${translation.x}px, ${translation.y}px);`);
        this.translationChangedSource.next();
    }

    get zoomRatio(): number {
        const percents = 100;
        return this._zoomPercentage / percents;
    }

    get zoomPercentage(): number {
        return this._zoomPercentage;
    }

    set zoomPercentage(zoomPercent: number) {
        this._zoomPercentage = zoomPercent;
        this.zoomPercentChangedSource.next();
    }

    private loadDrawing(drawingLoadOptions: DrawingLoadOptions): void {
        this.clearElements();

        this._dimensions = drawingLoadOptions.dimensions;
        this._backgroundColor = drawingLoadOptions.backgroundColor;

        const drawingData = drawingLoadOptions.drawingData;
        if (drawingData !== undefined) {
            this._id = drawingData.id;
            this._title = drawingData.title;
            this._labels = drawingData.labels;

            for (const element of drawingData.elements) {
                this.addElement(element);
            }
        } else {
            this._id = undefined;
            this._title = defaultTitle;
            this._labels = [];
        }

        this.saveDrawingToStorage();
        this.drawingLoadedSource.next();
    }

    private clearElements(): void {
        for (let i = this._elements.length - 1; i >= 0; i--) {
            this.removeElement(this._elements[i]);
        }
    }
}
