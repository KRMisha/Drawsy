import { TestBed } from '@angular/core/testing';

import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

// tslint:disable: no-string-literal

describe('ToolSelectionCollisionService', () => {
    let service: ToolSelectionCollisionService;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    const elementStub = {} as SVGGraphicsElement;
    let elementArrayStub: SVGGraphicsElement[];

    beforeEach(() => {
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
            svgElements: [],
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolSelectionCollisionService);
        elementArrayStub = [elementStub, elementStub];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getElementUnderArea should use GeometryService to filterOut the elements', () => {
        const filterSpy = spyOn(elementArrayStub, 'filter').and.callThrough();
        const areRectsIntersectingSpy = spyOn(service, 'areRectsIntersecting');
        const getElementsBoundSpy = spyOn(service, 'getElementBounds');

        service.getElementsUnderArea(elementArrayStub, {} as Rect);

        expect(filterSpy).toHaveBeenCalled();
        expect(areRectsIntersectingSpy).toHaveBeenCalled();
        expect(getElementsBoundSpy).toHaveBeenCalled();
    });

    it('#areRectsIntersecting should return true when the Rects are intersecting', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        expect(service.areRectsIntersecting(firstRect, secondRect)).toEqual(true);
    });

    it('#areRectsIntersecting should return true when the Rects are intersecting at single point', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 20, y: 20, width: 10, height: 10 };
        expect(service.areRectsIntersecting(firstRect, secondRect)).toEqual(true);
    });

    it('#areRectsIntersecting should return false when the Rects are not intersecting', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 30, y: 30, width: 10, height: 10 };
        expect(service.areRectsIntersecting(firstRect, secondRect)).toEqual(false);
    });

    it("#getElementeBounds should set the element's as drawingRoot's boundingRect methods to bound the element", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
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
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        elementSpyObj.getAttribute.and.returnValue('12');
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
    });

    it('#getElementListBound should loop through all the elements and find smallest bounding rect', () => {
        const bounds: Rect = { x: 69, y: 420, width: 911, height: 666 };
        spyOn(service, 'getElementBounds').and.returnValue(bounds);
        const element = {} as SVGGraphicsElement;
        const actualValue = service.getElementListBounds([element]);
        expect(actualValue).toEqual(bounds);
    });

    it('#getElementListBound should return undefined if element list is empty', () => {
        expect(service.getElementListBounds([])).toBeUndefined();
    });
});
