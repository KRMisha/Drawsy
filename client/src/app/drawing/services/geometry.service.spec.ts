import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { GeometryService } from '@app/drawing/services/geometry.service';

describe('GeometryService', () => {
    it("#getRectFromPoints's returned Rect should have a width and height of 0 when both Vec2 passed by parameter are the same", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 10, y: 10 };
        const expectedRect: Rect = { x: 10, y: 10, width: 0, height: 0 };
        const returnedRect = GeometryService.getRectFromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#getRectFromPoints's returned Rect should be the same no matter the order in which the Vec2 are provided", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const firstRectReturned = GeometryService.getRectFromPoints(firstPoint, secondPoint);
        const secondRectReturned = GeometryService.getRectFromPoints(secondPoint, firstPoint);
        expect(firstRectReturned).toEqual(secondRectReturned);
    });

    it("#getRectFromPoints's returned Rect should be valid when both given Vec2 are positive", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const expectedRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const returnedRect = GeometryService.getRectFromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#getRectFromPoints's returned Rect should be valid when both given Vec2 are negative", () => {
        const firstPoint: Vec2 = { x: -10, y: -10 };
        const secondPoint: Vec2 = { x: -20, y: -20 };
        const expectedRect: Rect = { x: -20, y: -20, width: 10, height: 10 };
        const returnedRect = GeometryService.getRectFromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#getRectFromPoints's returned Rect should be valid when both given Vec2 don't have the same sign", () => {
        const firstPoint: Vec2 = { x: -10, y: -10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const expectedRect: Rect = { x: -10, y: -10, width: 30, height: 30 };
        const returnedRect = GeometryService.getRectFromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it('#areRectsIntersecting should return true when the Rects are intersecting', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        expect(GeometryService.areRectsIntersecting(firstRect, secondRect)).toEqual(true);
    });

    it('#areRectsIntersecting should return true when the Rects are intersecting at single point', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 20, y: 20, width: 10, height: 10 };
        expect(GeometryService.areRectsIntersecting(firstRect, secondRect)).toEqual(true);
    });

    it('#areRectsIntersecting should return false when the Rects are not intersecting', () => {
        const firstRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const secondRect: Rect = { x: 30, y: 30, width: 10, height: 10 };
        expect(GeometryService.areRectsIntersecting(firstRect, secondRect)).toEqual(false);
    });
});
