export const MAX_COLOR_VALUE = 255;
export const MAX_HUE = 360;

export class Color {
    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.setRgb(red, green, blue);
        this.setAlpha(alpha);
    }

    setRgb(red: number, green: number, blue: number): void {
        this.red = Math.min(Math.max(red, 0), MAX_COLOR_VALUE);
        this.green = Math.min(Math.max(green, 0), MAX_COLOR_VALUE);
        this.blue = Math.min(Math.max(blue, 0), MAX_COLOR_VALUE);
    }

    setAlpha(alpha: number): void {
        this.alpha = Math.min(Math.max(alpha, 0), 1);
    }

    setHsv(hue: number, saturation: number, value: number): void {
        const minHue = 0;
        const minSaturation = 0;
        const maxSaturation = 1;
        const minValue = 0;
        const maxValue = 1;
        const sectionSize = 60;

        hue = Math.min(Math.max(minHue, hue), MAX_HUE);
        saturation = Math.min(Math.max(minSaturation, saturation), maxSaturation);
        value = Math.min(Math.max(minValue, value), maxValue);

        hue /= sectionSize;
        const chroma = value * saturation;
        const x = chroma * (1 - Math.abs((hue % 2) - 1));
        const m = value - chroma;

        if (hue <= 1) {
            this.setNormalizedColor(chroma + m, x + m, m);
        } else if (hue <= 2) {
            this.setNormalizedColor(x + m, chroma + m, m);
        } else if (hue <= 3) {
            this.setNormalizedColor(m, chroma + m, x + m);
        } else if (hue <= 4) {
            this.setNormalizedColor(m, x + m, chroma + m);
        } else if (hue <= 5) {
            this.setNormalizedColor(x + m, m, chroma + m);
        } else if (hue <= 6) {
            this.setNormalizedColor(chroma + m, m, x + m);
        }
    }

    getRed(): number {
        return this.red;
    }

    getGreen(): number {
        return this.green;
    }

    getBlue(): number {
        return this.blue;
    }

    getAlpha(): number {
        return this.alpha;
    }

    toRgbaString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    toRgbString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    equals(color: Color): boolean {
        return this.red === color.red && this.green === color.green && this.blue === color.blue;
    }

    private setNormalizedColor(red: number, green: number, blue: number) {
        this.red = red * MAX_COLOR_VALUE;
        this.green = green * MAX_COLOR_VALUE;
        this.blue = blue * MAX_COLOR_VALUE;
    }
}
