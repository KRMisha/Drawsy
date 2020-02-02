export class Color {
    red: number;
    green: number;
    blue: number;

    setColor(red: number, green: number, blue: number): void {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    setHsv(hue: number, saturation: number, value: number): void {
        const minHue = 0;
        const maxHue = 360;
        const minSaturation = 0;
        const maxSaturation = 1;
        const minValue = 0;
        const maxValue = 1;

        hue = Math.min(Math.max(minHue, hue), maxHue);
        saturation = Math.min(Math.max(minSaturation, saturation), maxSaturation);
        value = Math.min(Math.max(minValue, value), maxValue);

        console.log(hue);

        hue /= 60;
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

    toString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    private setNormalizedColor(red: number, green: number, blue: number) {
        this.red = red * 255;
        this.green = green * 255;
        this.blue = blue * 255;
    }
}
