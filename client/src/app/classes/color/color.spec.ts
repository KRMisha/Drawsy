import { Color } from './color';

describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        color = new Color();
    });

    it('#setRgb and #setAlpha should set to min 0', () => {
        color.red = -1;
        color.green = -1;
        color.blue = -1;
        color.alpha = -1;
        expect(color.getRgba()).toEqual([0, 0, 0, 0]);
    });

    it('#setRgb and #setAlpha should modify the value correctly', () => {
        color.red = 10;
        color.green = 20;
        color.blue = 30;
        color.alpha = 0.2;
        expect(color.getRgba()).toEqual([10, 20, 30, 0.2]);
    });

    it('rgb should have a max value of 255 and alpha of 1', () => {
        color.red = 300;
        color.green = 300;
        color.blue = 300;
        color.alpha = 10;
        expect(color.getRgba()).toEqual([255, 255, 255, 1]);
    });

    it('');
    it('#setNormalized Color should normalize on 255', () => {
        color['setNormalizedColor'](1, 1, 1);
        expect(color['red']).toEqual(255);
        expect(color['green']).toEqual(255);
        expect(color['blue']).toEqual(255);
    });
});
