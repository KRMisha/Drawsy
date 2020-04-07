import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: max-line-length

describe('DrawingService', () => {
    let service: DrawingService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('renderer2', ['appendChild', 'removeChild', 'insertBefore', 'listen']);
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['clearCommands']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        });
        service = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#addElement should push the element onto the _svgElements array, call #addElementClickListener and, if the svgDrawingContent is defined, call renderer's appendChild", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service['svgDrawingContent'] = {} as SVGGElement;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        const testElement = {} as SVGGraphicsElement;
        service.addElement(testElement);
        expect(service['_svgElements'][2]).toBe(testElement);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalled();
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
    });

    it("#addElement should push the element onto the _svgElements array, call #addElementClickListener but, if the svgDrawingContent is undefined, should not call renderer's appendChild", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        const testElement = {} as SVGGraphicsElement;
        service.addElement(testElement);
        expect(service['_svgElements'][2]).toBe(testElement);
        expect(renderer2SpyObj.appendChild).not.toHaveBeenCalled();
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
    });

    it("#addElementBefore should call #addElementClickListener and call renderer's insertBefore if the elementAfter is found in _svgElements and svgDrawingContent is not undefined", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, elementAfter];
        service['_svgElements'] = svgElementsMock;
        service['svgDrawingContent'] = {} as SVGGElement;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
        expect(renderer2SpyObj.insertBefore).toHaveBeenCalled();
    });

    it("#addElementBefore should call #addElementClickListener, but should not call renderer's insertBefore if the elementAfter is found, but the svgDrawingContent is undefined", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, elementAfter];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
        expect(renderer2SpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it("#addElementsBefore should not call #addElementClickListener or renderer's insertBefore if the elementAfter is not found in _svgElements", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).not.toHaveBeenCalled();
        expect(renderer2SpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it("#removeElement should call renderer's removeChild if the element was found in _svgElements and svgDrawingContent is not undefined", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        service['svgDrawingContent'] = {} as SVGGElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, testElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).toHaveBeenCalledWith(svgGraphicElement, testElement);
    });

    it("#removeElement should not call renderer's removeChild if the element was found, but the svgDrawingContent was undefined", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, testElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it("#removeElement should not call renderer's removeChild if the element was not found", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it("#addUiElement should call renderer's appendChild if svgUserInterfaceContent is not undefined", () => {
        const svgUserInterfaceContentStub = {} as SVGGElement;
        service['svgUserInterfaceContent'] = svgUserInterfaceContentStub;
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.addUiElement(svgGraphicsElementStub);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledWith(svgUserInterfaceContentStub, svgGraphicsElementStub);
    });

    it("#addUiElement should not call renderer's appendChild if svgUserInterfaceContent is undefined", () => {
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.addUiElement(svgGraphicsElementStub);
        expect(renderer2SpyObj.appendChild).not.toHaveBeenCalled();
    });

    it("#removeUiElement should call renderer's removeChild if svgUserInterfaceContent is not undefined", () => {
        const svgUserInterfaceContentStub = {} as SVGGElement;
        service['svgUserInterfaceContent'] = svgUserInterfaceContentStub;
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.removeUiElement(svgGraphicsElementStub);
        expect(renderer2SpyObj.removeChild).toHaveBeenCalledWith(svgUserInterfaceContentStub, svgGraphicsElementStub);
    });

    it("#removeUiElement should not call renderer's removeChild if svgUserInterfaceContent is undefined", () => {
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.removeUiElement(svgGraphicsElementStub);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it("#reappendStoredElements should call renderer's appendChild for each of the elements of _svgElements", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
        ];
        service['_svgElements'] = svgElementsMock;
        service.reappendStoredElements();
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledTimes(svgElementsMock.length);
    });

    it("#clearStoredElements should call renderer's removeChild for each of the elements of _svgElements", () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
            svgGraphicElement,
        ];
        service['_svgElements'] = svgElementsMock;
        service.clearStoredElements();
        expect(renderer2SpyObj.removeChild).toHaveBeenCalledTimes(svgElementsMock.length);
    });

    it('#appendNewMatrixToElements should call ', () => {
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['createSVGTransform']);
        service['drawingRoot'] = drawingRootSpyObj;

        const svgTransformListSpyObj = jasmine.createSpyObj('SVGTransformList', ['appendItem']);
        const svgAnimatedTransformListSpyObj = jasmine.createSpyObj('SVGAnimatedTransformList', [], { baseVal: svgTransformListSpyObj });
        const svgGraphicElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], { transform: svgAnimatedTransformListSpyObj });
        const elementsList: SVGGraphicsElement[] = [
            svgGraphicElementSpyObj,
            svgGraphicElementSpyObj,
            svgGraphicElementSpyObj,
            svgGraphicElementSpyObj,
        ];
        service.appendNewMatrixToElements(elementsList);
        expect(svgTransformListSpyObj.appendItem).toHaveBeenCalledTimes(elementsList.length);
    });

    it('#isDrawingStarted should return true if there is an element in _svgElements', () => {
        service['_svgElements'] = [{} as SVGGraphicsElement];
        const actualValue = service.isDrawingStarted();
        expect(actualValue).toEqual(true);
    });

    it('#isDrawingStarted should return false if there are no elements in _svgElements', () => {
        service['_svgElements'] = [];
        const actualValue = service.isDrawingStarted();
        expect(actualValue).toEqual(false);
    });

    it('#confirmNewDrawing should return false if there is a drawing started and the user declines the message', () => {
        spyOn(service, 'isDrawingStarted').and.returnValue(true);
        spyOn(window, 'confirm').and.returnValue(false);
        const actualValue = service.confirmNewDrawing({} as Vec2, {} as Color);
        expect(actualValue).toEqual(false);
    });

    it("#confirmNewDrawing should return true, call #clearStoredElements and call historyService's clearCommands if there is not a drawing started", () => {
        spyOn(service, 'isDrawingStarted').and.returnValue(false);
        const clearStoredElementsSpy = spyOn(service, 'clearStoredElements');
        const actualValue = service.confirmNewDrawing({} as Vec2, {} as Color);
        expect(actualValue).toEqual(true);
        expect(clearStoredElementsSpy).toHaveBeenCalled();
        expect(historyServiceSpyObj.clearCommands).toHaveBeenCalled();
    });

    it("#confirmNewDrawing should return true, call #clearStoredElements and call historyService's clearCommands if the user confirms the warning message", () => {
        spyOn(window, 'confirm').and.returnValue(true);
        const clearStoredElementsSpy = spyOn(service, 'clearStoredElements');
        const actualValue = service.confirmNewDrawing({} as Vec2, {} as Color);
        expect(actualValue).toEqual(true);
        expect(clearStoredElementsSpy).toHaveBeenCalled();
        expect(historyServiceSpyObj.clearCommands).toHaveBeenCalled();
    });

    it('#get svgElements should return the cached elements', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const expectedValue: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = expectedValue;
        const actualValue = service.svgElements;
        expect(actualValue).toEqual(expectedValue);
    });
});
