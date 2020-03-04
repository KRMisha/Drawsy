import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class GeometryService {
    getRectFromPoints(point1: Vec2, point2: Vec2): Rect {
        const rect = new Rect();

        rect.x = Math.min(point1.x, point2.x);
        rect.width = Math.abs(point1.x - point2.x);

        rect.y = Math.min(point1.y, point2.y);
        rect.height = Math.abs(point1.y - point2.y);

        return rect;
    }
}
