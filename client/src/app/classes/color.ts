export const hexRegex = new RegExp('^[0-9a-fA-F]{6}$');

export class Color {
    static readonly maxRgb = 255;
    static readonly maxHue = 360;

    private lastHue = 0;

    private _red = 0; // tslint:disable-line: variable-name
    get red(): number {
        return this._red;
    }
    set red(red: number) {
        this._red = this.clampValue(red, 0, Color.maxRgb);
    }

    private _green = 0; // tslint:disable-line: variable-name
    get green(): number {
        return this._green;
    }
    set green(green: number) {
        this._green = this.clampValue(green, 0, Color.maxRgb);
    }

    private _blue = 0; // tslint:disable-line: variable-name
    get blue(): number {
        return this._blue;
    }
    set blue(blue: number) {
        this._blue = this.clampValue(blue, 0, Color.maxRgb);
    }

    private _alpha = 1; // tslint:disable-line: variable-name
    get alpha(): number {
        return this._alpha;
    }
    set alpha(alpha: number) {
        this._alpha = this.clampValue(alpha, 0, 1);
    }

    static fromColor(color: Color): Color {
        const newColor = new Color();
        newColor.red = color.red;
        newColor.green = color.green;
        newColor.blue = color.blue;
        newColor.alpha = color.alpha;
        newColor.lastHue = color.lastHue;
        return newColor;
    }

    static fromRgb(red: number, green: number, blue: number): Color {
        const newColor = new Color();
        newColor.red = red;
        newColor.green = green;
        newColor.blue = blue;
        return newColor;
    }

    static fromRgba(red: number, green: number, blue: number, alpha: number): Color {
        const newColor = this.fromRgb(red, green, blue);
        newColor.alpha = alpha;
        return newColor;
    }

    static fromHsv(hue: number, saturation: number, value: number): Color {
        const newColor = new Color();
        newColor.setHsv(hue, value, saturation);
        return newColor;
    }

    static fromHex(hex: string): Color {
        const newColor = new Color();
        newColor.setHex(hex);
        return newColor;
    }

    static fromRgbaString(rgbaString: string): Color {
        const radix = 10;
        const rgbaValues = rgbaString
            .substring(rgbaString.indexOf('(') + 1, rgbaString.lastIndexOf(')'))
            .split(' ')
            .map((x: string) => parseInt(x.trim(), radix));
        const redIndex = 0;
        const greenIndex = 1;
        const blueIndex = 2;
        const alphaIndex = 3;
        return this.fromRgba(rgbaValues[redIndex], rgbaValues[greenIndex], rgbaValues[blueIndex], rgbaValues[alphaIndex]);
    }

    setHsv(hue: number, saturation: number, value: number): void {
        // All constants are taken from this algorithm:
        // https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
        // tslint:disable: no-magic-numbers

        const minHue = 0;
        const minSaturation = 0;
        const maxSaturation = 1;
        const minValue = 0;
        const maxValue = 1;
        const sectionSize = 60;

        hue = Math.min(Math.max(minHue, hue), Color.maxHue);
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
        } else {
            this.setNormalizedColor(chroma + m, m, x + m);
        }
        // tslint:enable: no-magic-numbers

        this.lastHue = hue;
    }

    setHex(hex: string): boolean {
        if (hexRegex.test(hex)) {
            // tslint:disable: no-magic-numbers
            const radix = 16;
            this.red = parseInt(hex.substring(0, 2), radix);
            this.green = parseInt(hex.substring(2, 4), radix);
            this.blue = parseInt(hex.substring(4, 6), radix);
            // tslint:enable: no-magic-numbers
            return true;
        }
        return false;
    }

    getHsv(): [number, number, number] {
        // All constants are taken from this algorithm:
        // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
        // tslint:disable: no-magic-numbers

        const redPrime = this.red / Color.maxRgb;
        const greenPrime = this.green / Color.maxRgb;
        const bluePrime = this.blue / Color.maxRgb;

        const cMax = Math.max(redPrime, greenPrime, bluePrime);
        const cMin = Math.min(redPrime, greenPrime, bluePrime);
        const deltaC = cMax - cMin;

        const angleValue = 60;

        let hue: number;
        if (deltaC === 0) {
            hue = this.lastHue;
        } else if (cMax === redPrime) {
            hue = angleValue * (((greenPrime - bluePrime) / deltaC) % 6);
        } else if (cMax === greenPrime) {
            hue = angleValue * ((bluePrime - redPrime) / deltaC + 2);
        } else {
            hue = angleValue * ((redPrime - greenPrime) / deltaC + 4);
        }

        if (hue < 0) {
            hue += Color.maxHue;
        }

        const saturation: number = cMax === 0 ? 0 : deltaC / cMax;

        const value = cMax;

        return [hue, saturation, value];
        // tslint:enable: no-magic-numbers
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

    private componentToHex(component: number): string {
        const hexBase = 16;
        const hex = Math.round(component).toString(hexBase);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private setNormalizedColor(red: number, green: number, blue: number): void {
        this.red = red * Color.maxRgb;
        this.green = green * Color.maxRgb;
        this.blue = blue * Color.maxRgb;
    }

    private clampValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
