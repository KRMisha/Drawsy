export const maxColorValue = 255;
export const maxHue = 360;
export const hexRegexStr = '^[0-9a-fA-F]{6}$';
export const hexRegex = new RegExp(hexRegexStr);

export class Color {
    private _red = 0; // tslint:disable-line: variable-name
    get red(): number {
        return this._red;
    }
    set red(red: number) {
        this._red = this.clampValue(red, 0, maxColorValue);
    }

    private _green = 0; // tslint:disable-line: variable-name
    get green(): number {
        return this._green;
    }
    set green(green: number) {
        this._green = this.clampValue(green, 0, maxColorValue);
    }

    private _blue = 0; // tslint:disable-line: variable-name
    get blue(): number {
        return this._blue;
    }
    set blue(blue: number) {
        this._blue = this.clampValue(blue, 0, maxColorValue);
    }

    private _alpha = 1; // tslint:disable-line: variable-name
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

        hue = Math.min(Math.max(minHue, hue), maxHue);
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

    setHex(hex: string): boolean {
        if (hexRegex.test(hex)) {
            this.red = parseInt(hex.substring(0, 2), 16);
            this.green = parseInt(hex.substring(2, 4), 16);
            this.blue = parseInt(hex.substring(4, 6), 16);
            return true;
        }
        return false;
    }

    getHsv(): [number, number, number] {
        const redPrime = this.red / maxColorValue;
        const greenPrime = this.green / maxColorValue;
        const bluePrime = this.blue / maxColorValue;

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
            hue += maxHue;
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

    toRgbaString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    toRgbString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    private componentToHex(component: number) {
        const hex = Math.round(component).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private setNormalizedColor(red: number, green: number, blue: number) {
        this.red = red * maxColorValue;
        this.green = green * maxColorValue;
        this.blue = blue * maxColorValue;
    }

    private clampValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
