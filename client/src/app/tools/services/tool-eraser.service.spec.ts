import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolEraserService } from '@app/tools/services/tool-eraser.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: max-line-length

describe('ToolEraserService', () => {
    let service: ToolEraserService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    // let getElementUnderAreaPixelPerfectSpy: any;
    const initialSvgEraserRect = {} as SVGRectElement;
    const svgGraphicsElementStub = {} as SVGGraphicsElement;
    const initialElementsArray = [svgGraphicsElementStub, svgGraphicsElementStub, svgGraphicsElementStub];
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'addClass']);
        renderer2SpyObj.createElement.and.returnValue(initialSvgEraserRect);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue({ x: 69, y: 911, width: 420, height: 666 } as DOMRect);

        drawingServiceSpyObj = jasmine.createSpyObj(
            'DrawingService',
            ['removeElement', 'addUiElement', 'removeUiElement', 'findDrawingChildElement', 'addUiElementBefore'],
            {
                drawingRoot: drawingRootSpyObj,
                elements: initialElementsArray,
            }
        );

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolEraserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#constructor should initialise the svgEraserRect using Renderer2', () => {
        service = TestBed.inject(ToolEraserService);
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(initialSvgEraserRect, 'fill', 'rgb(255, 255, 255)');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(initialSvgEraserRect, 'stroke-width', '1');
        expect(renderer2SpyObj.addClass).toHaveBeenCalledWith(initialSvgEraserRect, 'theme-eraser');
    });

    it('#onMouseMove should only call #updateEraserRect if the timerId is not undefined', () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const setTimeoutSpy = spyOn<any>(window, 'setTimeout');
        service['timerId'] = 0;
        service.onMouseMove({} as MouseEvent);

        expect(updateEraserRectSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('#onMouseMove should call #update after an interval when the timerId is undefined', () => {
        jasmine.clock().install();
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const updateSpy = spyOn<any>(service, 'update');

        service.onMouseMove({} as MouseEvent);
        expect(updateEraserRectSpy).toHaveBeenCalled();

        expect(updateSpy).not.toHaveBeenCalled();
        const msDelayBetweenCalls = 16;
        jasmine.clock().tick(msDelayBetweenCalls);
        expect(updateSpy).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    it("#onMouseDown should make a copy of the drawingService's elements and call #update", () => {
        const updateSpy = spyOn<any>(service, 'update');
        Tool.isMouseInsideDrawing = true;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(service['initialDrawingElements']).toEqual(initialElementsArray);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should return early if the button is not the left mouse button', () => {
        const updateSpy = spyOn<any>(service, 'update');
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(updateSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should add a removeElementCommand with the elements in the right order using the historyService', () => {
        const svgElementStub1 = {} as SVGGraphicsElement;
        const svgElementStub2 = {} as SVGGraphicsElement;
        const svgElementStub3 = {} as SVGGraphicsElement;

        service['initialDrawingElements'] = [svgElementStub1, svgElementStub2, svgElementStub3];

        const firstSiblingPair = { element: svgElementStub1, sibling: svgElementStub2 } as ElementSiblingPair;
        const secondSiblingPair = { element: svgElementStub2, sibling: svgElementStub3 } as ElementSiblingPair;

        service['elementsDeletedDuringDrag'] = [firstSiblingPair, secondSiblingPair];
        const expectedCommandElements = [secondSiblingPair, firstSiblingPair];
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new RemoveElementsCommand(drawingServiceSpyObj, expectedCommandElements)
        );
    });

    it('#onMouseUp should return early if the button is not the left mouse button', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        service.onMouseUp(event);
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onMouseUp should return early if the eraser did not delete anything during the drag', () => {
        service['elementsDeletedDuringDrag'] = [];
        const event = { button: MouseButton.Left } as MouseEvent;
        service.onMouseUp(event);
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onToolSelection should call #update and #updateEraserRect and add the UiElement with drawingService', () => {
        const svgEraserRectStub = {} as SVGRectElement;
        service['svgEraserRect'] = svgEraserRectStub;
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const updateSpy = spyOn<any>(service, 'update');

        service.onToolSelection();
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalledWith(svgEraserRectStub);
        expect(updateEraserRectSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(false);
    });

    it('#onToolDeselection should call #reset', () => {
        const resetSpy = spyOn<any>(service, 'reset').and.callThrough();
        service.onToolDeselection();
        expect(resetSpy).toHaveBeenCalled();
    });

    it('#onHistoryChange should call a tick on the applicationRef and call #update', () => {
        const applicationRefTickSpy = spyOn<any>(service['applicationRef'], 'tick');
        const updateSpy = spyOn<any>(service, 'update');

        service.onHistoryChange();
        expect(applicationRefTickSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('#updateEraserRect should update the eraserRect with the new value', () => {
        const unwantedEraserRect = {} as Rect;
        service['eraserRect'] = unwantedEraserRect;
        service['updateEraserRect']();
        expect(service['eraserRect']).not.toEqual(unwantedEraserRect);
    });

    it('#update should call #hideRedElementClone and set elementUnderCursor to undefined if the elementToConsider is undefined', () => {
        const getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
        getElementUnderAreaPixelPerfectSpy.and.returnValue(undefined);
        const hideRedElementCloneSpy = spyOn<any>(service, 'hideRedElementClone');
        service['update'](false);
        expect(hideRedElementCloneSpy).toHaveBeenCalled();
        expect(service['elementUnderCursor']).toBeUndefined();
    });

    it('#update should update the RedElementClone if the hoveredElement is different', () => {
        const hoveredElement = {} as SVGGraphicsElement;
        service['elementUnderCursor'] = {} as SVGGraphicsElement;
        const getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
        getElementUnderAreaPixelPerfectSpy.and.returnValue(hoveredElement);
        const hideRedElementCloneSpy = spyOn<any>(service, 'hideRedElementClone');
        const showRedElementCloneSpy = spyOn<any>(service, 'showRedElementClone');
        service['update'](false);
        expect(hideRedElementCloneSpy).toHaveBeenCalled();
        expect(service['elementUnderCursor']).toBe(hoveredElement);
        expect(showRedElementCloneSpy).toHaveBeenCalled();
    });

    it('#update should update the RedElementClone if called with true', () => {
        const previousHoveredElement = {} as SVGGraphicsElement;
        service['elementUnderCursor'] = previousHoveredElement;
        const getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
        getElementUnderAreaPixelPerfectSpy.and.returnValue(previousHoveredElement);
        const hideRedElementCloneSpy = spyOn<any>(service, 'hideRedElementClone');
        const showRedElementCloneSpy = spyOn<any>(service, 'showRedElementClone');
        service['update'](true);
        expect(hideRedElementCloneSpy).toHaveBeenCalled();
        expect(service['elementUnderCursor']).toBe(previousHoveredElement);
        expect(showRedElementCloneSpy).toHaveBeenCalled();
    });

    it('#update should update the elements deleted during the drag if the element is not undefined and the tool is currently erasing', () => {
        const previousHoveredElement = {} as SVGGraphicsElement;
        service['elementUnderCursor'] = previousHoveredElement;
        const getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
        getElementUnderAreaPixelPerfectSpy.and.returnValue(previousHoveredElement);

        const elementStub = {} as SVGGraphicsElement;
        const initialStubElementsArray = [elementStub, previousHoveredElement, elementStub];
        service['initialDrawingElements'] = initialStubElementsArray;

        service['isErasing'] = true;
        const hideRedElementCloneSpy = spyOn<any>(service, 'hideRedElementClone');

        service['update'](false);

        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
        expect(hideRedElementCloneSpy).toHaveBeenCalled();
        expect(service['elementUnderCursor']).toBeUndefined();
    });

    it('#update should not remove the element from the drawing service if the element was not initially there', () => {
        const previousHoveredElement = {} as SVGGraphicsElement;
        service['elementUnderCursor'] = previousHoveredElement;
        const getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
        getElementUnderAreaPixelPerfectSpy.and.returnValue(previousHoveredElement);

        const elementStub = {} as SVGGraphicsElement;
        const initialStubElementsArray = [elementStub, elementStub];
        service['initialDrawingElements'] = initialStubElementsArray;

        service['isErasing'] = true;
        const hideRedElementCloneSpy = spyOn<any>(service, 'hideRedElementClone');

        service['update'](false);

        expect(drawingServiceSpyObj.removeElement).not.toHaveBeenCalled();
        expect(hideRedElementCloneSpy).toHaveBeenCalled();
        expect(service['elementUnderCursor']).toBeUndefined();
    });

    it('#getElementUnderAreaPixelPerfect should return undefined if no shape is under cursor', () => {
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(undefined);
        const returnValue = service['getElementUnderAreaPixelPerfect']({ width: 1, height: 1, x: 0, y: 0 } as Rect);
        expect(returnValue).toBeUndefined();
    });

    it('#getElementUnderAreaPixelPerfect should return the topmost element if the cursor is over a shape', () => {
        const topmostElement = jasmine.createSpyObj('SVGGraphicsElement', ['compareDocumentPosition']);
        topmostElement.compareDocumentPosition.and.returnValue(Node.DOCUMENT_POSITION_PRECEDING);
        const notTopMostElement = jasmine.createSpyObj('SVGGraphicsElement', ['compareDocumentPosition']);
        notTopMostElement.compareDocumentPosition.and.returnValue(0);
        const otherElement = {} as SVGGraphicsElement;
        let firstIteration = true;
        let secondIteration = false;
        drawingServiceSpyObj.findDrawingChildElement.and.callFake((el: EventTarget) => {
            if (firstIteration) {
                firstIteration = false;
                secondIteration = true;
                return otherElement;
            } else if (secondIteration) {
                secondIteration = false;
                return notTopMostElement;
            }
            return topmostElement;
        });

        const returnValue = service['getElementUnderAreaPixelPerfect']({ width: 1, height: 3, x: 0, y: 0 } as Rect);
        expect(returnValue).toBe(topmostElement);
    });

    it('#showRedElementClone should return early if the elementUnderCursor is undefined', () => {
        service['elementUnderCursor'] = undefined;
        service['showRedElementClone']();
        expect(drawingServiceSpyObj.addUiElementBefore).not.toHaveBeenCalled();
    });

    it('#showRedElementClone should clone the elementUnderCursor and add it to the Ui elements of the drawing service', () => {
        const elementUnderCursorSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute', 'cloneNode']);
        elementUnderCursorSpyObj.cloneNode.and.returnValue({});
        service['elementUnderCursor'] = elementUnderCursorSpyObj;
        service['showRedElementClone']();
        expect(drawingServiceSpyObj.addUiElementBefore).toHaveBeenCalled();
    });

    it('#showRedElementClone should clone the elementUnderCursor and add it to the Ui elements of the drawing service', () => {
        const elementUnderCursorSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute', 'cloneNode']);
        elementUnderCursorSpyObj.getAttribute.and.returnValue('3');
        const rgbValue = 10;
        const colorStub = { red: rgbValue, green: rgbValue, blue: rgbValue } as Color;
        spyOn(Color, 'fromRgbaString').and.returnValue(colorStub);
        elementUnderCursorSpyObj.cloneNode.and.returnValue({});
        service['elementUnderCursor'] = elementUnderCursorSpyObj;
        service['showRedElementClone']();
        expect(drawingServiceSpyObj.addUiElementBefore).toHaveBeenCalled();
    });

    it('#showRedElementClone should change use different color if the current border is already red', () => {
        const elementUnderCursorSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute', 'cloneNode']);
        elementUnderCursorSpyObj.getAttribute.and.returnValue('3');
        const rgbValue = 10;
        const colorStub = { red: 255, green: rgbValue, blue: rgbValue } as Color;
        spyOn(Color, 'fromRgbaString').and.returnValue(colorStub);
        elementUnderCursorSpyObj.cloneNode.and.returnValue({});
        service['elementUnderCursor'] = elementUnderCursorSpyObj;
        service['showRedElementClone']();
        expect(drawingServiceSpyObj.addUiElementBefore).toHaveBeenCalled();
    });

    it('#hideRedElementClone should remove the element from the drawing and set it undefined', () => {
        const elementUnderCursorStub = {} as SVGGraphicsElement;
        service['elementUnderCursorClone'] = elementUnderCursorStub;
        service['hideRedElementClone']();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalledWith(elementUnderCursorStub);
        expect(service['elementUnderCursorClone']).toBeUndefined();
    });
});
