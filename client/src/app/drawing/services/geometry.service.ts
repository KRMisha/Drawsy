import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';

export class GeometryService {
    static getRectFromPoints(point1: Vec2, point2: Vec2): Rect {
        const rect = new Rect();

        rect.x = Math.min(point1.x, point2.x);
        rect.width = Math.abs(point1.x - point2.x);

        rect.y = Math.min(point1.y, point2.y);
        rect.height = Math.abs(point1.y - point2.y);

        return rect;
    }

    static areRectsIntersecting(rect1: Rect, rect2: Rect): boolean {
        const isHorizIntersecting = rect1.x + rect1.width >= rect2.x && rect1.x <= rect2.x + rect2.width;
        const isVertIntersecting = rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height;
        return isHorizIntersecting && isVertIntersecting;
    }
}
