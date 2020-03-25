import { SvgTransformations } from '@app/drawing/classes/svg-transformations';

describe('SvgTransformations', () => {
    let svgTransformation: SvgTransformations;

    beforeEach(() => {
        svgTransformation = new SvgTransformations();
    });

    it('should create an instance', () => {
        expect(svgTransformation).toBeTruthy();
    });

    it('#toString should return a string matching the transformation that is template-valid', () => {
        expect(svgTransformation.toString()).toBe(`translate(${svgTransformation.translation.x}, ${svgTransformation.translation.y})`);
    });
});
