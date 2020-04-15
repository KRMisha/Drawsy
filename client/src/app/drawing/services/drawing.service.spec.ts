import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { Vec2 } from '@app/shared/classes/vec2';
import { DrawingLoadOptions } from '../classes/drawing-load-options';
import { DrawingSerializerService } from './drawing-serializer.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: max-line-length
// tslint:disable: max-file-line-count

describe('DrawingService', () => {
    let service: DrawingService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('renderer2', ['appendChild', 'removeChild', 'insertBefore', 'listen']);
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', [
            'deserializeDrawing',
            'getDrawingLoadOptions',
            'serializeDrawing',
        ]);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
            ],
        });
        service = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#addElement should push the element into the _elements array and, if the svgDrawingContent is defined, call renderer's appendChild", () => {
        const pushSpy = spyOn<any>(service['_elements'], 'push');

        const svgDrawingContent = {} as SVGGElement;
        const testElement = {} as SVGGraphicsElement;

        service['svgDrawingContent'] = svgDrawingContent;
        service.addElement(testElement);
        expect(pushSpy).toHaveBeenCalledWith(testElement);
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledWith(svgDrawingContent, testElement);
    });

    it("#addElement should push the element into the _elements array but, if the svgDrawingContent is undefined, should not call renderer's appendChild", () => {
        const pushSpy = spyOn<any>(service['_elements'], 'push');

        const testElement = {} as SVGGraphicsElement;

        service.addElement(testElement);
        expect(pushSpy).toHaveBeenCalledWith(testElement);
        expect(renderer2SpyObj.appendChild).not.toHaveBeenCalled();
    });

    it("#addElementBefore should call renderer's insertBefore if the elementAfter is found in _elements and svgDrawingContent is not undefined", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement, elementAfter];

        service['_elements'] = elementsMock;
        service['svgDrawingContent'] = {} as SVGGElement;

        service.addElementBefore(testElement, elementAfter);
        expect(renderer2SpyObj.insertBefore).toHaveBeenCalled();
    });

    it("#addElementBefore should not call renderer's insertBefore if the elementAfter is found, but the svgDrawingContent is undefined", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement, elementAfter];

        service['_elements'] = elementsMock;

        service.addElementBefore(testElement, elementAfter);
        expect(renderer2SpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it("#addElementBefore should not call renderer's insertBefore if the elementAfter is not found in _elements", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const elementAfter = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement];

        service['_elements'] = elementsMock;

        service.addElementBefore(testElement, elementAfter);
        expect(renderer2SpyObj.insertBefore).not.toHaveBeenCalled();
    });

    it("#removeElement should call renderer's removeChild if the element was found in _elements and svgDrawingContent is not undefined", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        service['svgDrawingContent'] = {} as SVGGElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement, testElement];
        service['_elements'] = elementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).toHaveBeenCalledWith(svgGraphicsElement, testElement);
    });

    it("#removeElement should not call renderer's removeChild if the element was found, but the svgDrawingContent was undefined", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement, testElement];
        service['_elements'] = elementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it("#removeElement should not call renderer's removeChild if the element was not found", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const testElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement];
        service['_elements'] = elementsMock;
        service.removeElement(testElement);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it("#reappendStoredElements should call renderer's appendChild for each of the elements of _elements", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
        ];
        service['_elements'] = elementsMock;
        service.reappendStoredElements();
        expect(renderer2SpyObj.appendChild).toHaveBeenCalledTimes(elementsMock.length);
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

    it('#isDrawingStarted should return true if there is an item in the localStorage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('bonjour');
        const actualValue = service.isDrawingStarted();
        expect(actualValue).toEqual(true);
    });

    it('#isDrawingStarted should return false if there are no elements in _elements', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        const actualValue = service.isDrawingStarted();
        expect(actualValue).toEqual(false);
    });

    it('#loadDrawingWithConfirmation should return true and call #loadDrawing if there are no elements in the drawing', () => {
        service['_elements'] = [];
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        const returnValue = service.loadDrawingWithConfirmation(drawingLoadOptionsMock);
        expect(loadDrawingSpy).toHaveBeenCalledWith(drawingLoadOptionsMock);
        expect(returnValue).toEqual(true);
    });

    it('#loadDrawingWithConfirmation should return true and call #loadDrawing if the user confirms the warning message', () => {
        service['_elements'] = [{} as SVGGraphicsElement];
        spyOn(window, 'confirm').and.returnValue(true);
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        const returnValue = service.loadDrawingWithConfirmation(drawingLoadOptionsMock);
        expect(loadDrawingSpy).toHaveBeenCalledWith(drawingLoadOptionsMock);
        expect(returnValue).toEqual(true);
    });

    it('#loadDrawingWithConfirmation should return false  if the user declines the warning message and there are elements in the drawing', () => {
        service['_elements'] = [{} as SVGGraphicsElement];
        spyOn(window, 'confirm').and.returnValue(false);
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        const returnValue = service.loadDrawingWithConfirmation(drawingLoadOptionsMock);
        expect(loadDrawingSpy).not.toHaveBeenCalled();
        expect(returnValue).toEqual(false);
    });

    it('#loadDrawingFromStorage should return early if the element is not found in the storage', () => {
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        spyOn(localStorage, 'getItem').and.returnValue(null);
        service.loadDrawingFromStorage();
        expect(loadDrawingSpy).not.toHaveBeenCalled();
    });

    it('#loadDrawingFromStorage should call loadDrawing with the right drawingLoadOptions', () => {
        const expectedSerializedDrawing = 'bonjour';
        const expectedId = 'expectedId';
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            switch (key) {
                case 'drawingAutosaveContent':
                    return expectedSerializedDrawing;
                case 'drawingAutosaveId':
                    return expectedId;
                default:
                    return null;
            }
        });
        const svgFileContainerMock = {} as SvgFileContainer;
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        drawingSerializerServiceSpyObj.deserializeDrawing.and.returnValue(svgFileContainerMock);
        drawingSerializerServiceSpyObj.getDrawingLoadOptions.and.returnValue(drawingLoadOptionsMock);
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        service.loadDrawingFromStorage();
        expect(drawingSerializerServiceSpyObj.deserializeDrawing).toHaveBeenCalledWith(expectedSerializedDrawing, expectedId);
        expect(loadDrawingSpy).toHaveBeenCalledWith(drawingLoadOptionsMock);
    });

    it('#loadDrawingFromStorage should set the id to undefined if it is not found in the storage', () => {
        const expectedSerializedDrawing = 'bonjour';
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            switch (key) {
                case 'drawingAutosaveContent':
                    return expectedSerializedDrawing;
                default:
                    return null;
            }
        });
        const svgFileContainerMock = {} as SvgFileContainer;
        const drawingLoadOptionsMock = {} as DrawingLoadOptions;
        drawingSerializerServiceSpyObj.deserializeDrawing.and.returnValue(svgFileContainerMock);
        drawingSerializerServiceSpyObj.getDrawingLoadOptions.and.returnValue(drawingLoadOptionsMock);
        const loadDrawingSpy = spyOn<any>(service, 'loadDrawing');
        service.loadDrawingFromStorage();
        expect(drawingSerializerServiceSpyObj.deserializeDrawing).toHaveBeenCalledWith(expectedSerializedDrawing, undefined);
        expect(loadDrawingSpy).toHaveBeenCalledWith(drawingLoadOptionsMock);
    });

    it('#saveDrawingToStorage should return early if the drawingRoot is undefined', () => {
        const setItemSpy = spyOn(localStorage, 'setItem');
        delete service['drawingRoot'];
        service.saveDrawingToStorage();
        expect(setItemSpy).not.toHaveBeenCalled();
    });

    it('#saveDrawingtoStorage should save the drawing in the localStorage and save the id if the id is not undefined', () => {
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        const titleElementMock = { innerHTML: '' } as HTMLTitleElement;
        drawingRootSpyObj.getElementsByTagName.and.returnValue([titleElementMock]);
        service['drawingRoot'] = drawingRootSpyObj;
        const serializedDrawing = 'bonjour';
        drawingSerializerServiceSpyObj.serializeDrawing.and.returnValue(serializedDrawing);
        const setItemSpy = spyOn(localStorage, 'setItem');
        const expectedId = 'id';
        service['_id'] = expectedId;
        service.saveDrawingToStorage();
        expect(setItemSpy).toHaveBeenCalledWith('drawingAutosaveContent', serializedDrawing);
        expect(setItemSpy).toHaveBeenCalledWith('drawingAutosaveId', expectedId);
    });

    it('#saveDrawingtoStorage should save the drawing in the localStorage, and remove the id from the localStorage if the id is undefined', () => {
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getElementsByTagName']);
        const titleElementMock = { innerHTML: '' } as HTMLTitleElement;
        drawingRootSpyObj.getElementsByTagName.and.returnValue([titleElementMock]);
        service['drawingRoot'] = drawingRootSpyObj;
        const serializedDrawing = 'bonjour';
        drawingSerializerServiceSpyObj.serializeDrawing.and.returnValue(serializedDrawing);
        const setItemSpy = spyOn(localStorage, 'setItem');
        const removeItemSpy = spyOn(localStorage, 'removeItem');
        service['_id'] = undefined;
        service.saveDrawingToStorage();
        expect(setItemSpy).toHaveBeenCalledWith('drawingAutosaveContent', serializedDrawing);
        expect(removeItemSpy).toHaveBeenCalledWith('drawingAutosaveId');
    });

    it("#findDrawingChildElement should return undefined if the element'parent node is undefined", () => {
        const actualValue = service.findDrawingChildElement({} as EventTarget);
        expect(actualValue).toBeUndefined();
    });

    it('#findDrawingChildElement should return the element if its parent node is the svgDrawingContent', () => {
        const parentElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const childElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        parentElement.appendChild(childElement);
        service['svgDrawingContent'] = parentElement;
        const actualValue = service.findDrawingChildElement(childElement);
        expect(actualValue).toBe(childElement);
    });

    it('#findDrawingChildElement should return the direct decendent node of svgDrawingContent that relates to the passed element', () => {
        const parentElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const childElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const extendedCousin = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        parentElement.appendChild(childElement);
        childElement.appendChild(extendedCousin);
        service['svgDrawingContent'] = parentElement;
        const actualValue = service.findDrawingChildElement(extendedCousin);
        expect(actualValue).toBe(childElement);
    });

    it('#get id should return the id', () => {
        const expectedId = 'id';
        service['_id'] = expectedId;
        const actualValue = service.id;
        expect(actualValue).toEqual(expectedId);
    });

    it('#set id should set the id and call #saveDrawingToStorage', () => {
        const saveDrawingToStorageSpy = spyOn(service, 'saveDrawingToStorage');
        const expectedId = 'id';
        service.id = expectedId;
        const actualValue = service['_id'];
        expect(actualValue).toEqual(expectedId);
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#get title should return the title', () => {
        const expectedTitle = 'title';
        service['_title'] = expectedTitle;
        const actualValue = service.title;
        expect(actualValue).toEqual(expectedTitle);
    });

    it('#set title should set the title and call #saveDrawingToStorage', () => {
        const saveDrawingToStorageSpy = spyOn(service, 'saveDrawingToStorage');
        const expectedTitle = 'title';
        service.title = expectedTitle;
        const actualValue = service['_title'];
        expect(actualValue).toEqual(expectedTitle);
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#get labels should return the labels', () => {
        const expectedLabels = ['label'];
        service['_labels'] = expectedLabels;
        const actualValue = service.labels;
        expect(actualValue).toEqual(expectedLabels);
    });

    it("#set labels should set the labels, update forceDetectChangesSource's subscribers and call #saveDrawingToStorage", () => {
        const saveDrawingToStorageSpy = spyOn(service, 'saveDrawingToStorage');
        const nextSpy = spyOn(service['forceDetectChangesSource'], 'next');
        const expectedLabels = ['label'];
        service.labels = expectedLabels;
        const actualValue = service['_labels'];
        expect(actualValue).toEqual(expectedLabels);
        expect(nextSpy).toHaveBeenCalled();
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#get dimensions should return the dimensions', () => {
        const expectedDimensions = { x: 0, y: 0 } as Vec2;
        service['_dimensions'] = expectedDimensions;
        const actualValue = service.dimensions;
        expect(actualValue).toEqual(expectedDimensions);
    });

    it("#set dimensions should set the dimensions, update forceDetectChangesSource's subscribers and call #saveDrawingToStorage", () => {
        const saveDrawingToStorageSpy = spyOn(service, 'saveDrawingToStorage');
        const nextSpy = spyOn(service['forceDetectChangesSource'], 'next');
        const expectedDimensions = { x: 0, y: 0 } as Vec2;
        service.dimensions = expectedDimensions;
        const actualValue = service['_dimensions'];
        expect(actualValue).toEqual(expectedDimensions);
        expect(nextSpy).toHaveBeenCalled();
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#get backgroundColor should return the backgroundColor', () => {
        const expectedColor = {} as Color;
        service['_backgroundColor'] = expectedColor;
        const actualValue = service.backgroundColor;
        expect(actualValue).toEqual(expectedColor);
    });

    it("#set backgroundColor should set the backgroundColor, update forceDetectChangesSource's subscribers and call #saveDrawingToStorage", () => {
        const saveDrawingToStorageSpy = spyOn(service, 'saveDrawingToStorage');
        const nextSpy = spyOn(service['forceDetectChangesSource'], 'next');
        const expectedColor = {} as Color;
        service.backgroundColor = expectedColor;
        const actualValue = service['_backgroundColor'];
        expect(actualValue).toEqual(expectedColor);
        expect(nextSpy).toHaveBeenCalled();
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
    });

    it('#get elements should return the contained elements', () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const expectedValue: SVGGraphicsElement[] = [svgGraphicsElement, svgGraphicsElement];
        service['_elements'] = expectedValue;
        const actualValue = service.elements;
        expect(actualValue).toEqual(expectedValue);
    });

    it('#loadDrawing should call #clearElements, set the dimensions and the backgroundColor, call #saveDrawingToStorage and update the drawingLoadedSource subscription', () => {
        const clearElementsSpy = spyOn<any>(service, 'clearElements');
        const saveDrawingToStorageSpy = spyOn<any>(service, 'saveDrawingToStorage');
        const drawingLoadedSourceSpy = spyOn<any>(service['drawingLoadedSource'], 'next');
        const drawingLoadOptionsMock = { dimensions: {} as Vec2, backgroundColor: {} as Color } as DrawingLoadOptions;
        service['loadDrawing'](drawingLoadOptionsMock);
        expect(clearElementsSpy).toHaveBeenCalled();
        expect(service['_dimensions']).toBe(drawingLoadOptionsMock.dimensions);
        expect(service['_backgroundColor']).toBe(drawingLoadOptionsMock.backgroundColor);
        expect(saveDrawingToStorageSpy).toHaveBeenCalled();
        expect(drawingLoadedSourceSpy).toHaveBeenCalled();
    });

    it('#loadDrawing should set the id, the title and the labels of the drawing, as well as add all the elements if the drawingData of the loaded drawing is not undefined', () => {
        const addElementSpy = spyOn<any>(service, 'addElement');
        service['_id'] = 'id';
        service['_title'] = 'titre';
        service['_labels'] = ['label'];
        const elementMock = {} as SVGGraphicsElement;
        const drawingDataMock = {
            id: 'expectedId',
            title: 'expectedTitle',
            labels: ['expectedLabel'],
            elements: [elementMock, elementMock],
        };
        const drawingLoadOptionsMock = {
            dimensions: {} as Vec2,
            backgroundColor: {} as Color,
            drawingData: drawingDataMock,
        } as DrawingLoadOptions;
        service['loadDrawing'](drawingLoadOptionsMock);
        expect(service['_id']).toEqual('expectedId');
        expect(service['_title']).toEqual('expectedTitle');
        expect(service['_labels']).toEqual(['expectedLabel']);
        expect(addElementSpy).toHaveBeenCalledTimes(2);
        expect(addElementSpy).toHaveBeenCalledWith(elementMock);
    });

    it('#loadDrawing should set the id to undefined, set the title to the default title and empty the labels if the drawing data of the loaded drawing is undefined', () => {
        service['_id'] = 'id';
        service['_title'] = 'titre';
        service['_labels'] = ['label'];
        const drawingLoadOptionsMock = { dimensions: {} as Vec2, backgroundColor: {} as Color } as DrawingLoadOptions;
        service['loadDrawing'](drawingLoadOptionsMock);
        expect(service['_id']).toBeUndefined();
        expect(service['_title']).toEqual('Sans titre');
        expect(service['_labels'].length).toEqual(0);
    });

    it("#clearElements should call renderer's removeChild for each of the elements of _elements", () => {
        const svgGraphicsElement = {} as SVGGraphicsElement;
        const elementsMock: SVGGraphicsElement[] = [
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
            svgGraphicsElement,
        ];
        service['_elements'] = elementsMock;
        service['clearElements']();
        expect(renderer2SpyObj.removeChild).toHaveBeenCalledTimes(elementsMock.length);
    });
});
