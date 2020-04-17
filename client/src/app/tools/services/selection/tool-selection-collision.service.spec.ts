import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';

// tslint:disable: no-string-literal

describe('ToolSelectionCollisionService', () => {
    let service: ToolSelectionCollisionService;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
            elements: [{} as SVGGraphicsElement, {} as SVGGraphicsElement],
        });
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpyObj }],
        });
        service = TestBed.inject(ToolSelectionCollisionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#isPointInRect should return true if the point is inside the area', () => {
        const validPoint = { x: 1, y: 1 } as Vec2;
        const rect = { x: 0, y: 0, width: 2, height: 2 } as Rect;
        const returnValue = service.isPointInRect(validPoint, rect);
        expect(returnValue).toEqual(true);
    });

    it('#isPointInRect should return false if the point is outside the area', () => {
        const invalidPoint = { x: 4, y: 4 };
        const rect = { x: 0, y: 0, width: 2, height: 2 } as Rect;
        const returnValue = service.isPointInRect(invalidPoint, rect);
        expect(returnValue).toEqual(false);
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

    it('#getElementsUnderArea should filter out the elements not in the area', () => {
        const areRectsIntersectingSpy = spyOn(service, 'areRectsIntersecting');
        const getElementsBoundSpy = spyOn(service, 'getElementBounds');
        const filterSpy = spyOn(drawingServiceSpyObj.elements, 'filter').and.callThrough();

        service.getElementsUnderArea({} as Rect);

        expect(areRectsIntersectingSpy).toHaveBeenCalled();
        expect(getElementsBoundSpy).toHaveBeenCalled();
        expect(filterSpy).toHaveBeenCalled();
    });

    it("#getElementBounds should set the element's as drawingRoot's boundingRect methods to bound the element", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
    });

    it("#getElementBounds should set the element's data-padding attribute if it is not undefined", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        const expectedPadding = 12;
        elementSpyObj.getAttribute.and.returnValue(`${expectedPadding}`);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        const returnValue = service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(returnValue.x).toEqual(-expectedPadding);
        expect(returnValue.y).toEqual(-expectedPadding);
        expect(returnValue.width).toEqual(domRectStub.width + 2 * expectedPadding);
        expect(returnValue.height).toEqual(domRectStub.height + 2 * expectedPadding);
    });

    it("#getElementBounds should set the elements's data-padding to 0 if the attribute is undefined", () => {
        const domRectStub = { x: 10, y: 10, width: 10, height: 10 } as DOMRect;
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getBoundingClientRect', 'getAttribute']);
        elementSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        elementSpyObj.getAttribute.and.returnValue(null);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue(domRectStub);
        service['drawingService'] = ({ drawingRoot: drawingRootSpyObj } as unknown) as DrawingService;

        const returnValue = service.getElementBounds(elementSpyObj);
        expect(elementSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(drawingRootSpyObj.getBoundingClientRect).toHaveBeenCalled();
        expect(returnValue.x).toEqual(0);
        expect(returnValue.y).toEqual(0);
        expect(returnValue.width).toEqual(domRectStub.width);
        expect(returnValue.height).toEqual(domRectStub.height);
    });

    it('#getElementListBounds should loop through all the elements and find smallest bounding rect', () => {
        const bounds: Rect = { x: 69, y: 420, width: 911, height: 666 };
        spyOn(service, 'getElementBounds').and.returnValue(bounds);
        const element = {} as SVGGraphicsElement;
        const actualValue = service.getElementListBounds([element]);
        expect(actualValue).toEqual(bounds);
    });

    it('#getElementListBounds should return undefined if element list is empty', () => {
        expect(service.getElementListBounds([])).toBeUndefined();
    });
});
