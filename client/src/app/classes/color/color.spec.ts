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

    it('#setRgb and #setAlpha should modify the value correctly', () => {
        color.red = 10;
        color.green = 20;
        color.blue = 30;
        color.alpha = 0.2;
        expect(color.red).toEqual(10);
        expect(color.green).toEqual(20);
        expect(color.blue).toEqual(30);
        expect(color.alpha).toEqual(0.2);
    });

    it('rgb should have a max value of 255 and alpha of 1', () => {
        color.red = 300;
        color.green = 300;
        color.blue = 300;
        color.alpha = 10;
        expect(color.red).toEqual(255);
        expect(color.green).toEqual(255);
        expect(color.blue).toEqual(255);
        expect(color.alpha).toEqual(1);
    });

    it('');
    it('#setNormalized Color should normalize on 255', () => {
        color['setNormalizedColor'](1, 1, 1);
        expect(color['red']).toEqual(255);
        expect(color['green']).toEqual(255);
        expect(color['blue']).toEqual(255);
    });
});
