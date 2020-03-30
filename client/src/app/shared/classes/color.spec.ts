import { Color } from '@app/shared/classes/color';

// tslint:disable: no-magic-numbers

describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        color = new Color();
    });

    it('should create an instance', () => {
        expect(color).toBeTruthy();
    });

    it('#fromRgb should return a color with the provided rgb values', () => {
        const expectedRed = 100;
        const expectedGreen = 100;
        const expectedBlue = 100;

        const returnedColor = Color.fromRgb(expectedRed, expectedGreen, expectedBlue);
        expect(returnedColor.red).toEqual(expectedRed);
        expect(returnedColor.green).toEqual(expectedGreen);
        expect(returnedColor.blue).toEqual(expectedBlue);
    });

    it('#fromRgba should return a color with the provided rgba values', () => {
        const expectedRed = 100;
        const expectedGreen = 100;
        const expectedBlue = 100;
        const expectedAlpha = 0.5;

        const returnedColor = Color.fromRgba(expectedRed, expectedGreen, expectedBlue, expectedAlpha);
        expect(returnedColor.red).toEqual(expectedRed);
        expect(returnedColor.green).toEqual(expectedGreen);
        expect(returnedColor.blue).toEqual(expectedBlue);
        expect(returnedColor.alpha).toEqual(expectedAlpha);
    });

    it('#fromHsv should return valid color with corresponding rgb values', () => {
        color = Color.fromHsv(0, 0.2, 0.2);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([51, 41, 41]);
        color = Color.fromHsv(0, 0.2, 0.46);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([117, 94, 94]);
        color = Color.fromHsv(0, 0.64, 0.19);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([48, 17, 17]);
        color = Color.fromHsv(101, 0.66, 0.38);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([53, 97, 33]);
        color = Color.fromHsv(239, 0.66, 0.38);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([33, 34, 97]);
        color = Color.fromHsv(287, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([81, 32, 94]);
        color = Color.fromHsv(70, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([84, 94, 32]);
        color = Color.fromHsv(125, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([32, 94, 37]);
        color = Color.fromHsv(350, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([94, 32, 42]);
    });

    it('#fromHex should return a new color when called with a valid hex color', () => {
        color = Color.fromHex('f51d1d');
        expect([color.red, color.green, color.blue]).toEqual([245, 29, 29]);
        color = Color.fromHex('f5b81d');
        expect([color.red, color.green, color.blue]).toEqual([245, 184, 29]);
        color = Color.fromHex('90f51d');
        expect([color.red, color.green, color.blue]).toEqual([144, 245, 29]);
    });

    it('#fromHex should return the default color when called with an invalid hex color', () => {
        color = Color.fromHex('');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color = Color.fromHex('12345');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color = Color.fromHex('fefefz');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color = Color.fromHex('1234567');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
    });

    it('#fromRgbString should return a new color with the corresponding rgb value when the string is valid', () => {
        color = Color.fromRgbString('rgb(1, 10, 10)');
        expect([color.red, color.green, color.blue]).toEqual([1, 10, 10]);
        color = Color.fromRgbString('rgb(100, 64, 22)');
        expect([color.red, color.green, color.blue]).toEqual([100, 64, 22]);
        color = Color.fromRgbString('rgb(96, 90, 78)');
        expect([color.red, color.green, color.blue]).toEqual([96, 90, 78]);
    });

    it('#fromRgbString should return the default color when the string is invalid', () => {
        color = Color.fromRgbString('xd');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color = Color.fromRgbString('you think its a joke');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color = Color.fromRgbString('rgb(96, 90, 78,)');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
    });

    it('#fromRgbaString should return a new color with the corresponding rgba value when the string is valid', () => {
        color = Color.fromRgbaString('rgba(1, 10, 10, 1)');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([1, 10, 10, 1]);
        color = Color.fromRgbaString('rgba(100, 64, 22, 0.9)');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([100, 64, 22, 0.9]);
        color = Color.fromRgbaString('rgba(96, 90, 78, 0.12)');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([96, 90, 78, 0.12]);
    });

    it('#fromRgbaString should return the default color when the string is invalid', () => {
        color = Color.fromRgbaString('please send help');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([0, 0, 0, 1]);
        color = Color.fromRgbaString('rgba(96, 90, 78,,,,, 0.12)');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([0, 0, 0, 1]);
        color = Color.fromRgbaString('rgb(96, 90, 78, 0.12)');
        expect([color.red, color.green, color.blue, color.alpha]).toEqual([0, 0, 0, 1]);
    });

    it('#clone should return a copy of color as a new Object', () => {
        const colorClone = color.clone();
        expect(colorClone).toEqual(color);
        expect(colorClone).not.toBe(color);
    });

    it('#equal should return true when both colors have the same rgba value', () => {
        const firstColor = new Color();
        const secondColor = new Color();
        const result = firstColor.equals(secondColor);
        expect(result).toEqual(true);
    });

    it('#equal should return false when both colors have a different rgba', () => {
        const firstColor = new Color();
        const secondColor = new Color();
        firstColor.red = 12;
        secondColor.red = 10;
        const result = firstColor.equals(secondColor);
        expect(result).toEqual(false);
    });

    it('#getHsv should return corresponding hsv values', () => {
        color.red = 50;
        color.green = 50;
        color.blue = 50;
        let hsv = color.getHsv();
        expect([Math.round(hsv[0] * 100) / 100, Math.round(hsv[1] * 100) / 100, Math.round(hsv[2] * 100) / 100]).toEqual([0, 0, 0.2]);

        color.red = 55;
        color.green = 50;
        color.blue = 50;
        hsv = color.getHsv();
        expect([Math.round(hsv[0] * 100) / 100, Math.round(hsv[1] * 100) / 100, Math.round(hsv[2] * 100) / 100]).toEqual([0, 0.09, 0.22]);

        color.red = 50;
        color.green = 55;
        color.blue = 50;
        hsv = color.getHsv();
        expect([Math.round(hsv[0] * 100) / 100, Math.round(hsv[1] * 100) / 100, Math.round(hsv[2] * 100) / 100]).toEqual([120, 0.09, 0.22]);

        color.red = 50;
        color.green = 50;
        color.blue = 55;
        hsv = color.getHsv();
        expect([Math.round(hsv[0] * 100) / 100, Math.round(hsv[1] * 100) / 100, Math.round(hsv[2] * 100) / 100]).toEqual([240, 0.09, 0.22]);

        color.red = 0;
        color.green = 0;
        color.blue = 0;
        hsv = color.getHsv();
        expect([Math.round(hsv[0] * 100) / 100, Math.round(hsv[1] * 100) / 100, Math.round(hsv[2] * 100) / 100]).toEqual([0, 0, 0]);
    });

    it('#getHex should return a valid hex color string', () => {
        const radix = 16;
        let expectedHex: string;

        color.red = parseInt('f5', radix);
        color.green = parseInt('1d', radix);
        color.blue = parseInt('1d', radix);
        expectedHex = 'f51d1d';
        expect(color.getHex()).toEqual(expectedHex);

        color.red = parseInt('ad', radix);
        color.green = parseInt('ad', radix);
        color.blue = parseInt('ad', radix);
        expectedHex = 'adadad';
        expect(color.getHex()).toEqual(expectedHex);

        color.red = parseInt('fe', radix);
        color.green = parseInt('fe', radix);
        color.blue = parseInt('fe', radix);
        expectedHex = 'fefefe';
        expect(color.getHex()).toEqual(expectedHex);
    });

    it('#toRgbString should return a valid rgb color string', () => {
        color.red = 123;
        color.green = 124;
        color.blue = 125;
        expect(color.toRgbString()).toEqual('rgb(123, 124, 125)');
    });

    it('#toRgbaString should return a valid rgba color string', () => {
        color.red = 123;
        color.green = 124;
        color.blue = 125;
        color.alpha = 0.9;
        expect(color.toRgbaString()).toEqual('rgba(123, 124, 125, 0.9)');
    });

    it('setters should modify the values correctly if values are in range', () => {
        color.red = 10;
        color.green = 20;
        color.blue = 30;
        color.alpha = 0.2;
        expect(color.red).toEqual(10);
        expect(color.green).toEqual(20);
        expect(color.blue).toEqual(30);
        expect(color.alpha).toEqual(0.2);
    });

    it('rgb should have a max value of 255 and a max alpha of 1', () => {
        color.red = 300;
        color.green = 300;
        color.blue = 300;
        color.alpha = 10;
        expect(color.red).toEqual(255);
        expect(color.green).toEqual(255);
        expect(color.blue).toEqual(255);
        expect(color.alpha).toEqual(1);
    });

    it('setters should clamp values to min 0', () => {
        color.red = -1;
        color.green = -1;
        color.blue = -1;
        color.alpha = -1;
        expect(color.red).toEqual(0);
        expect(color.green).toEqual(0);
        expect(color.blue).toEqual(0);
        expect(color.alpha).toEqual(0);
    });
});
