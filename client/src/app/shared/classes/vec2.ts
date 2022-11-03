export class Vec2 {
    x: number;
    y: number;

    // Force Vec2 to be instantiated as an interface
    private constructor() {}

    static add(first: Vec2, second: Vec2): Vec2 {
        return {x: first.x + second.x, y: first.y + second.y};
    }

    static substract(first: Vec2, second: Vec2): Vec2 {
        return {x: first.x - second.x, y: first.y - second.y};
    }

    static scale(value: number, vector: Vec2): Vec2 {
        return {x: value * vector.x, y: value * vector.y};
    }

    static distance(start: Vec2, end: Vec2): number {
        const line = Vec2.substract(end, start);
        return Math.sqrt(Math.pow(line.x, 2) + Math.pow(line.y, 2));
    }

    static angle(start: Vec2, end: Vec2): number {
        const line = Vec2.substract(end, start);
        return Math.atan2(line.y, line.x);
    }
}
