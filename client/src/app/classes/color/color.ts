export const MAX_COLOR_VALUE = 255;
export const MAX_HUE = 360;

export class Color {
    private _red = 0;
    get red(): number {
        return this._red;
    }
    set red(red: number) {
        this._red = this.clampValue(red, 0, MAX_COLOR_VALUE);
    }

    private _green = 0;
    get green(): number {
        return this._green;
    }
    set green(green: number) {
        this._green = this.clampValue(green, 0, MAX_COLOR_VALUE);
    }

    private _blue = 0;
    get blue(): number {
        return this._blue;
    }
    set blue(blue: number) {
        this._blue = this.clampValue(blue, 0, MAX_COLOR_VALUE);
    }

    private _alpha = 1;
    get alpha(): number {
        return this._alpha;
    }
    set alpha(alpha: number) {
        this._alpha = this.clampValue(alpha, 0, 1);
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

    setHex(hex: string) {
        hex = hex.replace('#', '');
        this.red = parseInt(hex.substring(0, 2), 16);
        this.green = parseInt(hex.substring(2, 4), 16);
        this.blue = parseInt(hex.substring(4, 6), 16);
    }

    getHsv(): [number, number, number] {
        const redPrime = this.red / MAX_COLOR_VALUE;
        const greenPrime = this.green / MAX_COLOR_VALUE;
        const bluePrime = this.blue / MAX_COLOR_VALUE;

        const cMax = Math.max(redPrime, greenPrime, bluePrime);
        const cMin = Math.min(redPrime, greenPrime, bluePrime);
        const deltaC = cMax - cMin;

        const angleValue = 60;

        let hue: number;
        if (deltaC === 0) {
            hue = 0;
        } else if (cMax === redPrime) {
            hue = angleValue * (((greenPrime - bluePrime) / deltaC) % 6);
        } else if (cMax === greenPrime) {
            hue = angleValue * ((bluePrime - redPrime) / deltaC + 2);
        } else {
            hue = angleValue * ((redPrime - greenPrime) / deltaC + 4);
        }

        if (hue < 0) {
            hue += 360;
        }

        let saturation: number;
        if (cMax === 0) {
            saturation = 0;
        } else {
            saturation = deltaC / cMax;
        }

        const value = cMax;

        return [hue, saturation, value];
    }

    getHex(): string {
        return '' + this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
    }

    getRgba(): [number, number, number, number] {
        return [this.red, this.green, this.blue, this.alpha];
    }

    toRgbaString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    toRgbString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    rgbEquals(color: Color): boolean {
        return this.red === color.red && this.green === color.green && this.blue === color.blue;
    }

    private componentToHex(component: number) {
        const hex = Math.round(component).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private setNormalizedColor(red: number, green: number, blue: number) {
        this.red = red * MAX_COLOR_VALUE;
        this.green = green * MAX_COLOR_VALUE;
        this.blue = blue * MAX_COLOR_VALUE;
    }

    private clampValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
