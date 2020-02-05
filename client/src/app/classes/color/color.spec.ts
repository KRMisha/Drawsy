import { Color } from './color';

describe('Color', () => {
    let color: Color;

    beforeEach(() => { color = new Color(0, 0, 0, 0); });

    it('#setRgb should be min 0', () => {
        color.setRgb(-1, -1, -1);
        expect(color.getBlue).toBe(0);
        expect(color.getGreen).toBe(0);
        expect(color.getRed).toBe(0);
    });

    it('#setRgb should modify the value correctly', () => {
        color.setRgb(10, 20, 30);
        expect(color.getBlue).toBe(10);
        expect(color.getGreen).toBe(20);
        expect(color.getRed).toBe(30);
    });

    it('#setRgb should be max 255', () => {
        color.setRgb(300, 300, 300);
        expect(color.getBlue).toBe(255);
        expect(color.getGreen).toBe(255);
        expect(color.getRed).toBe(255);
    });

    it('#setAlpha should be min 0', () => {
        color.setAlpha(-1);
        expect(color.getAlpha).toBe(0);
    });

    it('#setAlpha should modify the value correctly', () => {
        color.setAlpha(0.3);
        expect(color.getAlpha).toBe(0.3);
    });

    it('#setAlpha should be max 1', () => {
        color.setAlpha(10);
        expect(color.getAlpha).toBe(1);
    });

});
