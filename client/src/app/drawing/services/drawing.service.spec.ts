import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { CommandService } from './command.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { Color } from '@app/shared/classes/color';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: max-line-length

fdescribe('DrawingService', () => {
    let service: DrawingService;
    let rendererSpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;

    beforeEach(() => {
        rendererSpyObj = jasmine.createSpyObj('renderer2', [
            'appendChild',
            'removeChild',
            'insertBefore',
            'listen',
        ]);
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(rendererSpyObj);
        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['clearCommands']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
        });
        service = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addElement should push the element onto the _svgElements array, call #addElementClickListener and, if the svgDrawingContent is defined, call renderer\'s appendChild', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service['svgDrawingContent'] = {} as SVGGElement;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        const testElement = {} as SVGGraphicsElement;
        service.addElement(testElement);
        expect(service['_svgElements'][2]).toBe(testElement);
        expect(rendererSpyObj.appendChild).toHaveBeenCalled();
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
    });

    it('#addElement should push the element onto the _svgElements array, call #addElementClickListener but, if the svgDrawingContent is undefined, should not call renderer\'s appendChild', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        const testElement = {} as SVGGraphicsElement;
        service.addElement(testElement);
        expect(service['_svgElements'][2]).toBe(testElement);
        expect(rendererSpyObj.appendChild).not.toHaveBeenCalled();
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
    });

    it('#addElementBefore should call #addElementClickListener and call renderer\'s insertBefore if the elementAfter is found in _svgElements and svgDrawingContent is not undefined', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, elementAfter];
        service['_svgElements'] = svgElementsMock;
        service['svgDrawingContent'] = {} as SVGGElement;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
        expect(rendererSpyObj.insertBefore).toHaveBeenCalled();
    });

    it('#addElementBefore should call #addElementClickListener, but should not call renderer\'s insertBefore if the elementAfter is found, but the svgDrawingContent is undefined', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, elementAfter];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).toHaveBeenCalledWith(testElement);
        expect(rendererSpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it('#addElementsBefore should not call #addElementClickListener or renderer\'s insertBefore if the elementAfter is not found in _svgElements', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        const addElementClickListenerSpy = spyOn<any>(service, 'addElementClickListener').and.callThrough();
        service.addElementBefore(testElement, elementAfter);
        expect(addElementClickListenerSpy).not.toHaveBeenCalled();
        expect(rendererSpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it('#removeElement should call renderer\'s removeChild if the element was found in _svgElements and svgDrawingContent is not undefined', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        service['svgDrawingContent'] = {} as SVGGElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, testElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(rendererSpyObj.removeChild).toHaveBeenCalledWith(svgGraphicElement, testElement);
    });

    it('#removeElement should not call renderer\'s removeChild if the element was found, but the svgDrawingContent was undefined', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, testElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
    });

    it('#removeElement should not call renderer\'s removeChild if the element was not found', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service.removeElement(testElement);
        expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
    });

    it('#removeElement should unlisten from the elementClickListen function if it is found', () => {
        const functionSpy = jasmine.createSpy();
        spyOn(service['elementClickUnlistenFunctionMap'], 'get').and.returnValue(functionSpy);
        service.removeElement({} as SVGGraphicsElement);
        expect(functionSpy).toHaveBeenCalled();
    });

    it('#removeElement should call elementClickUnlistenFunctionMap\'s delete function', () => {
        const deleteSpy = spyOn(service['elementClickUnlistenFunctionMap'], 'delete');
        const testElement = {} as SVGGraphicsElement;
        service.removeElement(testElement);
        expect(deleteSpy).toHaveBeenCalledWith(testElement);
    });

    it('#addUiElement should call renderer\'s appendChild if svgUserInterfaceContent is not undefined', () => {
        const svgUserInterfaceContentStub = {} as SVGGElement;
        service['svgUserInterfaceContent'] = svgUserInterfaceContentStub;
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.addUiElement(svgGraphicsElementStub);
        expect(rendererSpyObj.appendChild).toHaveBeenCalledWith(svgUserInterfaceContentStub, svgGraphicsElementStub);
    });

    it('#addUiElement should not call renderer\'s appendChild if svgUserInterfaceContent is undefined', () => {
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.addUiElement(svgGraphicsElementStub);
        expect(rendererSpyObj.appendChild).not.toHaveBeenCalled();
    });

    it('#removeUiElement should call renderer\'s removeChild if svgUserInterfaceContent is not undefined', () => {
        const svgUserInterfaceContentStub = {} as SVGGElement;
        service['svgUserInterfaceContent'] = svgUserInterfaceContentStub;
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.removeUiElement(svgGraphicsElementStub);
        expect(rendererSpyObj.removeChild).toHaveBeenCalledWith(svgUserInterfaceContentStub, svgGraphicsElementStub);
    });

    it('#removeUiElement should not call renderer\'s removeChild if svgUserInterfaceContent is undefined', () => {
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        service.removeUiElement(svgGraphicsElementStub);
        expect(rendererSpyObj.removeChild).not.toHaveBeenCalled();
    });

    it('#reappendStoredElements should call renderer\'s appendChild for each of the elements of _svgElements', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, svgGraphicElement, svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service.reappendStoredElements();
        expect(rendererSpyObj.appendChild).toHaveBeenCalledTimes(svgElementsMock.length);
    });

    it('#clearStoredElements should call renderer\'s removeChild for each of the elements of _svgElements', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const svgElementsMock: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement, svgGraphicElement, svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = svgElementsMock;
        service.clearStoredElements();
        expect(rendererSpyObj.removeChild).toHaveBeenCalledTimes(svgElementsMock.length);
    });

    it('#appendNewMatrixToElements should call ', () => {
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['createSVGTransform']);
        service['drawingRoot'] = drawingRootSpyObj;

        const svgTransformListSpyObj = jasmine.createSpyObj('SVGTransformList', ['appendItem']);
        const svgAnimatedTransformListSpyObj = jasmine.createSpyObj('SVGAnimatedTransformList', [], { baseVal: svgTransformListSpyObj });
        const svgGraphicElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], { transform: svgAnimatedTransformListSpyObj });
        const elementsList: SVGGraphicsElement[] = [svgGraphicElementSpyObj, svgGraphicElementSpyObj, svgGraphicElementSpyObj, svgGraphicElementSpyObj];
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

    it('#confirmNewDrawing should return true, call #clearStoredElements and call commandService\'s clearCommands if there is not a drawing started', () => {
        spyOn(service, 'isDrawingStarted').and.returnValue(false);
        const clearStoredElementsSpy = spyOn(service, 'clearStoredElements');
        const actualValue = service.confirmNewDrawing({} as Vec2, {} as Color);
        expect(actualValue).toEqual(true);
        expect(clearStoredElementsSpy).toHaveBeenCalled();
        expect(commandServiceSpyObj.clearCommands).toHaveBeenCalled();
    });

    it('#confirmNewDrawing should return true, call #clearStoredElements and call commandService\'s clearCommands if the user confirms the warning message', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        const clearStoredElementsSpy = spyOn(service, 'clearStoredElements');
        const actualValue = service.confirmNewDrawing({} as Vec2, {} as Color);
        expect(actualValue).toEqual(true);
        expect(clearStoredElementsSpy).toHaveBeenCalled();
        expect(commandServiceSpyObj.clearCommands).toHaveBeenCalled();
    });

    it('#get svgElements should return the cached elements', () => {
        const svgGraphicElement = {} as SVGGraphicsElement;
        const expectedValue: SVGGraphicsElement[] = [svgGraphicElement, svgGraphicElement];
        service['_svgElements'] = expectedValue;
        const actualValue = service.svgElements;
        expect(actualValue).toEqual(expectedValue);
    });

    it('#addElementClickListener should create a listener for onmouseup on the element, which calls elementClickedSource\'s next', async(() => {
        const nextSpy = spyOn(service['elementClickedSource'], 'next');
        rendererSpyObj.listen.and.callThrough();
        const svgGraphicElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['onmouseup']);
        svgGraphicElementSpyObj.onmouseup.and.callThrough();
        service['addElementClickListener'](svgGraphicElementSpyObj);
        svgGraphicElementSpyObj.onmouseup({} as MouseEvent);
        expect(nextSpy).toHaveBeenCalled();
    }));
});
