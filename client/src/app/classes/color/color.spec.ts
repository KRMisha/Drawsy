import { Color } from './color';

describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        color = new Color(0, 0, 0, 0);
    });

    it('#setRgb and #setAlpha should set to min 0', () => {
        color.setRgb(-1, -1, -1);
        color.setAlpha(-1);
        expect(color.getRgba()).toEqual([0, 0, 0, 0]);
    });

    it('#setRgb and #setAlpha should modify the value correctly', () => {
        color.setRgb(10, 20, 30);
        color.setAlpha(0.2);
        expect(color.getRgba()).toEqual([10, 20, 30, 0.2]);
    });

    it('rgb should have a max value of 255 and alpha of 1', () => {
        color.setRgb(300, 300, 300);
        color.setAlpha(10);
        expect(color.getRgba()).toEqual([255, 255, 255, 1]);
    });

    it('#setNormalized Color should normalize on 255', () => {
        color['setNormalizedColor'](1, 1, 1);
        expect(color['red']).toEqual(255);
        expect(color['green']).toEqual(255);
        expect(color['blue']).toEqual(255);
    });
});
