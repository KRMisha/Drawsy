export class Color {
    r: number;
    g: number;
    b: number;

    constructor(red: number, green: number, blue: number) {
        this.setColor(red, green, blue);
    }

    setColor(red: number, green: number, blue: number): void {
        this.r = red;
        this.g = green;
        this.b = blue;
    }
}
