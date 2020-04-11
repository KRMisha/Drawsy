import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';

describe('Rect', () => {
    it("#fromPoint's returned Rect should have a width and height of 0 when both Vec2 passed by parameter are the same", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 10, y: 10 };
        const expectedRect: Rect = { x: 10, y: 10, width: 0, height: 0 };
        const returnedRect = Rect.fromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#fromPoint's returned Rect should be the same no matter the order in which the Vec2 are provided", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const firstRectReturned = Rect.fromPoints(firstPoint, secondPoint);
        const secondRectReturned = Rect.fromPoints(secondPoint, firstPoint);
        expect(firstRectReturned).toEqual(secondRectReturned);
    });

    it("#fromPoint's returned Rect should be valid when both given Vec2 are positive", () => {
        const firstPoint: Vec2 = { x: 10, y: 10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const expectedRect: Rect = { x: 10, y: 10, width: 10, height: 10 };
        const returnedRect = Rect.fromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#fromPoint's returned Rect should be valid when both given Vec2 are negative", () => {
        const firstPoint: Vec2 = { x: -10, y: -10 };
        const secondPoint: Vec2 = { x: -20, y: -20 };
        const expectedRect: Rect = { x: -20, y: -20, width: 10, height: 10 };
        const returnedRect = Rect.fromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });

    it("#fromPoint's returned Rect should be valid when both given Vec2 don't have the same sign", () => {
        const firstPoint: Vec2 = { x: -10, y: -10 };
        const secondPoint: Vec2 = { x: 20, y: 20 };
        const expectedRect: Rect = { x: -10, y: -10, width: 30, height: 30 };
        const returnedRect = Rect.fromPoints(firstPoint, secondPoint);
        expect(returnedRect.x).toEqual(expectedRect.x);
        expect(returnedRect.y).toEqual(expectedRect.y);
        expect(returnedRect.width).toEqual(expectedRect.width);
        expect(returnedRect.height).toEqual(expectedRect.height);
    });
});
