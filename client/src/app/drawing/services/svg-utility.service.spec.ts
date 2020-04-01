import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { DrawingService } from './drawing.service';
import { GeometryService } from './geometry.service';

// tslint:disable: no-string-literal

fdescribe('SvgUtilityService', () => {
    let service: SvgUtilityService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceMock: DrawingService;

    const elementStub = {} as SVGGraphicsElement;
    let elementArrayStub: SVGGraphicsElement[];

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        drawingServiceMock = ({
            drawingRoot: undefined,
            svgElements: [],
        } as unknown) as DrawingService;

        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceMock },
            ],
        });
        service = TestBed.inject(SvgUtilityService);
        elementArrayStub = [elementStub, elementStub];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getElementUnderArea should use GeometryService to filterOut the elements', () => {
        const filterSpy = spyOn(elementArrayStub, 'filter').and.callThrough();
        const areRectsIntersectingSpy = spyOn(GeometryService, 'areRectsIntersecting');
        const getElementsBoundSpy = spyOn(service, 'getElementBounds');

        service.getElementsUnderArea(elementArrayStub, {} as Rect);

        expect(filterSpy).toHaveBeenCalled();
        expect(areRectsIntersectingSpy).toHaveBeenCalled();
        expect(getElementsBoundSpy).toHaveBeenCalled();
    });

    // it('#getElementUnderAreaPixelPerfect should create a map from the elements array and assign a number to each', () => {
    //     const area: Rect = {width: 0, height: 0, x: 0, y: 0};
    //     const mapSpyObj = jasmine.createSpyObj('Map<SVGGraphicsElement, number>', ['set']);
    //     const mapConstructorSpy = spyOn<any>(window.Map, 'Map').and.returnValue(mapSpyObj);
    //     const drawingServiceStub = {svgElements: elementArrayStub};
    //     service['drawingService'] = drawingServiceStub as unknown as DrawingService;

    //     service.getElementUnderAreaPixelPerfect(elementArrayStub, area);

    //     expect(mapConstructorSpy).toHaveBeenCalled();
    //     expect(mapSpyObj.set).toHaveBeenCalledTimes(elementArrayStub.length);
    // });

    it("#updateSvgRectFromRect should use renderer2 to set the svgRect's attributes", () => {
        const svgRectStub = {} as SVGRectElement;
        const rect: Rect = { x: 10, y: 10, width: 10, height: 10 };

        service.updateSvgRectFromRect(svgRectStub, rect);

        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'x', rect.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'y', rect.y.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'width', rect.width.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'height', rect.height.toString());
    });

    it("#getElementeBounds should set the element's as drawingRoot's boundingRect methods to bound the element", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
    });

    it("#getElementeBounds should set the element's data-padding attribute if it is not undefined", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        elementSpyObj.getAttribute.and.returnValue('12');
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
    });

    // it('#getElementListBound should loop through all the elements and find smallest bounding rect', () => {

    // });

    it('#createDashedRectBorder should create a svg rect element and set its color according to the one passed by parameter', () => {
        const colorValue = 10;
        const colorStub = { red: colorValue, green: colorValue, blue: colorValue } as Color;
        const svgRectStub = {} as SVGRectElement;
        renderer2SpyObj.createElement.and.returnValue(svgRectStub);

        service.createDashedRectBorder(colorStub);

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
            svgRectStub,
            'fill',
            `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.2)`
        );
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-dasharray', '5, 3');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-width', '2');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'stroke-linecap', 'round');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(
            svgRectStub,
            'stroke',
            `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.8)`
        );
    });
});
