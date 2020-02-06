import { Color } from './color';

describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        color = new Color(0, 0, 0, 0);
    });

    it('#setRgb should be min 0', () => {
        color.setRgb(-1, -1, -1);
        expect(color.getRed()).toEqual(0);
        expect(color.getGreen()).toEqual(0);
        expect(color.getBlue()).toEqual(0);
    });

    it('#setRgb should modify the value correctly', () => {
        color.setRgb(10, 20, 30);
        expect(color.getRed()).toEqual(10);
        expect(color.getGreen()).toEqual(20);
        expect(color.getBlue()).toEqual(30);
    });

    it('#setRgb should be max 255', () => {
        color.setRgb(300, 300, 300);
        expect(color.getRed()).toEqual(255);
        expect(color.getGreen()).toEqual(255);
        expect(color.getBlue()).toEqual(255);
    });

    it('#setAlpha should be min 0', () => {
        color.setAlpha(-1);
        expect(color.getAlpha()).toEqual(0);
    });

    it('#setAlpha should modify the value correctly', () => {
        color.setAlpha(0.3);
        expect(color.getAlpha()).toEqual(0.3);
    });

    it('#setAlpha should be max 1', () => {
        color.setAlpha(10);
        expect(color.getAlpha()).toEqual(1);
    });

    it('#setNormalized Color should normalize on 255', () => {
        color['setNormalizedColor'](1, 1, 1);
        expect(color['red']).toEqual(255);
        expect(color['green']).toEqual(255);
        expect(color['blue']).toEqual(255);
    });
});
