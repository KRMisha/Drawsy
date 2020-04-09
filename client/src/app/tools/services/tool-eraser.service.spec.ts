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

    let getElementUnderAreaPixelPerfectSpy: any;

    const sVGGraphicsElementStub = {} as SVGGraphicsElement;
    const svgElementsInitialArray = [sVGGraphicsElementStub, sVGGraphicsElementStub, sVGGraphicsElementStub];
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue({ x: 69, y: 911, width: 420, height: 666 } as DOMRect);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['removeElement', 'addUiElement', 'removeUiElement'], {
            drawingRoot: drawingRootSpyObj,
            svgElements: svgElementsInitialArray,
        });

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolEraserService);

        getElementUnderAreaPixelPerfectSpy = spyOn<any>(service, 'getElementUnderAreaPixelPerfect').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
        const updateSpy = spyOn(service, 'update');

        service.onMouseMove({} as MouseEvent);
        expect(updateEraserRectSpy).toHaveBeenCalled();

        expect(updateSpy).not.toHaveBeenCalled();
        const msDelayBetweenCalls = 16;
        jasmine.clock().tick(msDelayBetweenCalls);
        expect(updateSpy).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    it("#onMouseDown should make a copy of the drawingService's svgElements and call #update", () => {
        const updateSpy = spyOn(service, 'update');
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(service['drawingElementsCopy']).toEqual(svgElementsInitialArray);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should return early if the button is not the left mouse button', () => {
        const updateSpy = spyOn(service, 'update');
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(updateSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should add a removeElementCommand with the elements in the right order using the historyService', () => {
        const svgElementStub1 = {} as SVGGraphicsElement;
        const svgElementStub2 = {} as SVGGraphicsElement;
        const svgElementStub3 = {} as SVGGraphicsElement;

        service['drawingElementsCopy'] = [svgElementStub1, svgElementStub2, svgElementStub3];

        const firstSiblingPair = { element: svgElementStub1, sibling: svgElementStub2 } as ElementSiblingPair;
        const secondSiblingPair = { element: svgElementStub2, sibling: svgElementStub3 } as ElementSiblingPair;

        service['svgElementsDeletedDuringDrag'] = [firstSiblingPair, secondSiblingPair];
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
        service['svgElementsDeletedDuringDrag'] = [];
        const event = { button: MouseButton.Left } as MouseEvent;
        service.onMouseUp(event);
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onMouseEnter should call #updateEraserRect', () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        service.onMouseEnter({} as MouseEvent);
        expect(updateEraserRectSpy).toHaveBeenCalled();
    });

    it('#update should call #restoreElementUndorCursorAttributes and set svgElementUnderCursor to undefined if the elementToConsider is undefined', () => {
        getElementUnderAreaPixelPerfectSpy.and.returnValue(undefined);
        const restoreElementUnderCursorAttributesSpy = spyOn<any>(service, 'restoreElementUnderCursorAttributes').and.callThrough();
        service.update();
        expect(restoreElementUnderCursorAttributesSpy).toHaveBeenCalled();
        expect(service['svgElementUnderCursor']).toBeUndefined();
    });

    it('#update should call #restoreElementUndorCursorAttributes, change svgElementUnderCursor and call #addRedBorderToElement if the elementToConsider is not the svgElementUnderCursor', () => {
        const testElement = {} as SVGGraphicsElement;
        service['svgElementUnderCursor'] = {} as SVGGraphicsElement;
        getElementUnderAreaPixelPerfectSpy.and.returnValue(testElement);
        const restoreElementUnderCursorAttributesSpy = spyOn<any>(service, 'restoreElementUnderCursorAttributes').and.callThrough();
        const addRedBorderSpy = spyOn<any>(service, 'addRedBorderToElement');
        service.update();
        expect(restoreElementUnderCursorAttributesSpy).toHaveBeenCalled();
        expect(addRedBorderSpy).toHaveBeenCalledWith(testElement);
        expect(service['svgElementUnderCursor']).toBe(testElement);
    });

    it('#update should not call #restoreElementUndorCursorAttributes, should not change svgElementUnderCursor and should not call #addRedBorderToElement if the elementToConsider is the svgElementUnderCursor', () => {
        const testElement = {} as SVGGraphicsElement;
        getElementUnderAreaPixelPerfectSpy.and.returnValue(testElement);
        const restoreElementUnderCursorAttributesSpy = spyOn<any>(service, 'restoreElementUnderCursorAttributes');
        const addRedBorderSpy = spyOn<any>(service, 'addRedBorderToElement');
        service['svgElementUnderCursor'] = testElement;
        service.update();
        expect(restoreElementUnderCursorAttributesSpy).not.toHaveBeenCalled();
        expect(addRedBorderSpy).not.toHaveBeenCalled();
    });

    it("#update should add the svgElementUnderCursor to the svgElementsDeletedDuringDrag and call drawingService's removeElement if the svgElementUnderCursor is not undefined, the left mouse button is pressed inside the drawing and the element is in the drawingElementsCopy", () => {
        const pushSpy = spyOn(service['svgElementsDeletedDuringDrag'], 'push');
        const testElement = {} as SVGGraphicsElement;
        const fillElement = {} as SVGGraphicsElement;
        const drawingElementsCopy = [fillElement, fillElement, fillElement, testElement];
        Tool.isLeftMouseButtonDown = true;
        service['isLeftMouseButtonDownInsideDrawing'] = true;
        getElementUnderAreaPixelPerfectSpy.and.returnValue(testElement);
        service['svgElementUnderCursor'] = testElement;
        service['drawingElementsCopy'] = drawingElementsCopy;
        service.update();
        expect(pushSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledWith(testElement);
        expect(service['svgElementUnderCursor']).toBeUndefined();
    });

    it("#update should not add the svgElementUnderCursor to the svgElementsDeletedDuringDrag, should not call drawingService's removeElement and should set svgElementUnderCursor to undefined if the svgElementUnderCursor not in drawingElementsCopy", () => {
        const pushSpy = spyOn(service['svgElementsDeletedDuringDrag'], 'push');
        const testElement = {} as SVGGraphicsElement;
        const fillElement = {} as SVGGraphicsElement;
        const drawingElementsCopy = [fillElement, fillElement, fillElement];
        Tool.isLeftMouseButtonDown = true;
        service['isLeftMouseButtonDownInsideDrawing'] = true;
        getElementUnderAreaPixelPerfectSpy.and.returnValue(testElement);
        service['svgElementUnderCursor'] = testElement;
        service['drawingElementsCopy'] = drawingElementsCopy;
        service.update();
        expect(pushSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.removeElement).not.toHaveBeenCalled();
        expect(service['svgElementUnderCursor']).toBeUndefined();
    });

    it("#onToolSelection should create the eraser's rect, add it to the ui elements of drawingService and call #updateEraserRect", () => {
        const updateEraserRectSpy = spyOn<any>(service, 'updateEraserRect');
        const svgEraserElementStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgEraserElementStub);

        service.onToolSelection();

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'fill', '#fafafa');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'stroke', '#424242');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgEraserElementStub, 'stroke-width', '1');
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalledWith(svgEraserElementStub);
        expect(updateEraserRectSpy);
    });

    it("onToolDeselection should call drawingService's removeUiElement, call #restoreElementUnderCursorAttributes and set svgElementUnderCursor to undefined", () => {
        service['svgElementUnderCursor'] = {} as SVGGraphicsElement;
        const restoreSpy = spyOn<any>(service, 'restoreElementUnderCursorAttributes');
        service.onToolDeselection();
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
        expect(service['svgElementUnderCursor']).toBeUndefined();
    });

    it('#updateEraserRect should update the eraserRect with the new value', () => {
        const unwantedEraserRect = {} as Rect;
        service['eraserRect'] = unwantedEraserRect;
        service['updateEraserRect']();
        expect(service['eraserRect']).not.toEqual(unwantedEraserRect);
    });

    it("#addRedBorderToElement should use default values to call renderer's setAttribute when the attributs of the element are none", () => {
        spyOn(Color, 'fromRgbaString').and.returnValue({ red: 255, green: 255, blue: 255, alpha: 1 } as Color);
        const elementToSendSpy = jasmine.createSpyObj('SVGCircleElement', ['getAttribute']);
        elementToSendSpy.getAttribute.and.returnValue('none');
        service['addRedBorderToElement'](elementToSendSpy);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke', 'rgb(255, 0, 0)');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke-width', '3');
    });

    it('#addRedBorderToElement should put default border width to 3 if object doesn not have a border initially', () => {
        spyOn(Color, 'fromRgbaString').and.returnValue({ red: 255, green: 255, blue: 255, alpha: 1 } as Color);
        const elementToSendSpy = jasmine.createSpyObj('SVGCircleElement', ['getAttribute']);
        elementToSendSpy.getAttribute.and.returnValue(undefined);
        service['addRedBorderToElement'](elementToSendSpy);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke', 'rgb(255, 0, 0)');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke-width', '3');
    });

    it('#addRedBorderToElement should put a bigger stroke width when object is selected with eraser', () => {
        spyOn(Color, 'fromRgbaString').and.returnValue({ red: 255, green: 255, blue: 255, alpha: 1 } as Color);
        const elementToSendSpy = jasmine.createSpyObj('SVGCircleElement', ['getAttribute']);
        elementToSendSpy.getAttribute.and.returnValue('123');
        service['addRedBorderToElement'](elementToSendSpy);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke', 'rgb(255, 0, 0)');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke-width', '135.84');
    });

    it('#addRedBorderToElement should put a dark red border if color of object is red', () => {
        spyOn(Color, 'fromRgbaString').and.returnValue({ red: 255, green: 0, blue: 0, alpha: 1 } as Color);
        const elementToSendSpy = jasmine.createSpyObj('SVGCircleElement', ['getAttribute']);
        elementToSendSpy.getAttribute.and.returnValue('123');
        service['addRedBorderToElement'](elementToSendSpy);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(elementToSendSpy, 'stroke', 'rgb(117, 30, 33)');
    });

    it('#getElementUnderAreaPixelPerfect should return undefined if no shape is under cursor', () => {
        spyOn(document, 'elementFromPoint').and.returnValue(null);
    });

    it('#getElementUnderAreaPixelPerfect should return the topmost element if the cursor is over a shape', () => {
        const elementToSend = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawingService'] = ({
            drawingRoot: drawingRootSpyObj,
            svgElements: [elementToSend],
        } as unknown) as DrawingService;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], { parentElement: elementToSend });

        spyOn(document, 'elementFromPoint').and.returnValue(elementSpyObj);
    });

    it('#getElementUnderAreaPixelPerfect should return undefined if no objects are in the drawing service', () => {
        const elementToSend = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawingService'] = ({
            drawingRoot: drawingRootSpyObj,
            svgElements: [elementToSend],
        } as unknown) as DrawingService;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], { parentElement: elementToSend });

        spyOn(document, 'elementFromPoint').and.returnValue(elementSpyObj);
    });
});
