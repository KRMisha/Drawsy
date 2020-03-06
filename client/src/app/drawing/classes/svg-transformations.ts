import { Vec2 } from '@app/classes/vec2';

export class SvgTransformations {
    translation: Vec2 = { x: 0, y: 0 };

    toString(): string {
        return `translate(${this.translation.x}, ${this.translation.y})`;
    }
}
