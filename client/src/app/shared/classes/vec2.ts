export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public static add(first: Vec2, second: Vec2): Vec2 {
        return new Vec2(first.x + second.x, first.y + second.y);
    }

    public static substract(first: Vec2, second: Vec2): Vec2 {
        return new Vec2(first.x - second.x, first.y - second.y);
    }

    public static scale(value: number, vector: Vec2): Vec2 {
        return new Vec2(value * vector.x, value * vector.y);
    }
}
