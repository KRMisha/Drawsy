import Regexes from '@app/shared/constants/regexes';

export class Color {
    static readonly maxRgb = 255;
    static readonly maxHue = 360;

    // tslint:disable: variable-name
    private _red = 0;
    private _green = 0;
    private _blue = 0;
    private _alpha = 1;
    // tslint:enable: variable-name

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
        // All constants are taken from this algorithm:
        // https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
        // tslint:disable: no-magic-numbers

        const minHue = 0;
        const minSaturation = 0;
        const maxSaturation = 1;
        const minValue = 0;
        const maxValue = 1;

        hue = Math.min(Math.max(minHue, hue), Color.maxHue);
        saturation = Math.min(Math.max(minSaturation, saturation), maxSaturation);
        value = Math.min(Math.max(minValue, value), maxValue);

        const sectionSize = 60;
        hue /= sectionSize;

        const chroma = value * saturation;
        const x = chroma * (1 - Math.abs((hue % 2) - 1));
        const m = value - chroma;

        let newColor: Color;
        if (hue <= 1) {
            newColor = Color.fromRgb(chroma + m, x + m, m);
        } else if (hue <= 2) {
            newColor = Color.fromRgb(x + m, chroma + m, m);
        } else if (hue <= 3) {
            newColor = Color.fromRgb(m, chroma + m, x + m);
        } else if (hue <= 4) {
            newColor = Color.fromRgb(m, x + m, chroma + m);
        } else if (hue <= 5) {
            newColor = Color.fromRgb(x + m, m, chroma + m);
        } else {
            newColor = Color.fromRgb(chroma + m, m, x + m);
        }
        newColor.red *= Color.maxRgb;
        newColor.green *= Color.maxRgb;
        newColor.blue *= Color.maxRgb;

        return newColor;
        // tslint:enable: no-magic-numbers
    }

    static fromHex(hex: string): Color {
        const newColor = new Color();

        if (Regexes.sixHexRegex.test(hex)) {
            const radix = 16;
            // tslint:disable: no-magic-numbers
            newColor.red = parseInt(hex.substring(0, 2), radix);
            newColor.green = parseInt(hex.substring(2, 4), radix);
            newColor.blue = parseInt(hex.substring(4, 6), radix);
            // tslint:enable: no-magic-numbers
        }

        return newColor;
    }

    static fromRgbString(rgbString: string): Color {
        const matches = rgbString.match(Regexes.rgbRegex) || undefined;
        if (matches === undefined) {
            return new Color();
        }

        const redIndex = 1;
        const greenIndex = 2;
        const blueIndex = 3;
        return this.fromRgb(parseFloat(matches[redIndex]), parseFloat(matches[greenIndex]), parseFloat(matches[blueIndex]));
    }

    static fromRgbaString(rgbaString: string): Color {
        const matches = rgbaString.match(Regexes.rgbaRegex) || undefined;
        if (matches === undefined) {
            return new Color();
        }

        const redIndex = 1;
        const greenIndex = 2;
        const blueIndex = 3;
        const alphaIndex = 4;
        return this.fromRgba(
            parseFloat(matches[redIndex]),
            parseFloat(matches[greenIndex]),
            parseFloat(matches[blueIndex]),
            parseFloat(matches[alphaIndex])
        );
    }

    clone(): Color {
        const newColor = new Color();
        newColor.red = this.red;
        newColor.green = this.green;
        newColor.blue = this.blue;
        newColor.alpha = this.alpha;
        return newColor;
    }

    equals(color: Color): boolean {
        return this.red === color.red && this.green === color.green && this.blue === color.blue && this.alpha === color.alpha;
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
            hue = 0;
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

    toRgbString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    toRgbaString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    get red(): number {
        return this._red;
    }

    set red(red: number) {
        this._red = this.clampValue(red, 0, Color.maxRgb);
    }

    get green(): number {
        return this._green;
    }

    set green(green: number) {
        this._green = this.clampValue(green, 0, Color.maxRgb);
    }

    get blue(): number {
        return this._blue;
    }

    set blue(blue: number) {
        this._blue = this.clampValue(blue, 0, Color.maxRgb);
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(alpha: number) {
        this._alpha = this.clampValue(alpha, 0, 1);
    }

    private componentToHex(component: number): string {
        const hexBase = 16;
        const hex = Math.round(component).toString(hexBase);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private clampValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
