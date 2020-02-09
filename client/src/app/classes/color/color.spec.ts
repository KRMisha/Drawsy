import { Color } from './color';

describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        color = new Color();
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

    it('should modify the value correctly if values are in range', () => {
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

    it('color should be set correctly when sent a valid hex color', () => {
        color.setHex('f51d1d');
        expect([color.red, color.green, color.blue]).toEqual([245, 29, 29]);
        color.setHex('f5b81d');
        expect([color.red, color.green, color.blue]).toEqual([245, 184, 29]);
        color.setHex('90f51d');
        expect([color.red, color.green, color.blue]).toEqual([144, 245, 29]);
    });

    it('color should not change when sent an invalid hex color', () => {
        color.red = 0;
        color.green = 0;
        color.blue = 0;
        color.setHex('');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color.setHex('12345');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color.setHex('fefefz');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
        color.setHex('1234567');
        expect([color.red, color.green, color.blue]).toEqual([0, 0, 0]);
    });

    it('setting color hsv should return corresponding rgb values', () => {
        color.setHsv(0, 0.2, 0.2);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([51, 41, 41]);
        color.setHsv(0, 0.2, 0.46);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([117, 94, 94]);
        color.setHsv(0, 0.64, 0.19);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([48, 17, 17]);
        color.setHsv(101, 0.66, 0.38);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([53, 97, 33]);
        color.setHsv(287, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([81, 32, 94]);
        color.setHsv(70, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([84, 94, 32]);
        color.setHsv(125, 0.66, 0.37);
        expect([Math.round(color.red), Math.round(color.green), Math.round(color.blue)]).toEqual([32, 94, 37]);
    });

    it('setting color values should return corresponding hsv values', () => {
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

    it('color should return valid hex', () => {
        color.setHex('f51d1d');
        expect(color.getHex()).toEqual('f51d1d');
        color.setHex('asdf');
        expect(color.getHex()).toEqual('f51d1d');
        color.setHex('fefefe');
        expect(color.getHex()).toEqual('fefefe');
    });

    it('color should return valid rgb string', () => {
        color.red = 123;
        color.green = 124;
        color.blue = 125;
        expect(color.toRgbString()).toEqual('rgb(123, 124, 125)');
    });

    it('color should return valid rgba string', () => {
        color.red = 123;
        color.green = 124;
        color.blue = 125;
        color.alpha = 0.9;
        expect(color.toRgbaString()).toEqual('rgba(123, 124, 125, 0.9)');
    });
});
