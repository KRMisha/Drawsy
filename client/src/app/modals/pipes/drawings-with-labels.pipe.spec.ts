import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { DrawingsWithLabelsPipe } from './drawings-with-labels.pipe';

describe('DrawingsWithLabelsPipe', () => {
    let pipe: DrawingsWithLabelsPipe;

    beforeEach(() => {
        pipe = new DrawingsWithLabelsPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return reversed drawings array if there are no search labels', () => {
        const drawing1 = {} as SvgFileContainer;
        const drawing2 = {} as SvgFileContainer;
        const drawingArray = [drawing1, drawing2];
        const result = pipe.transform(drawingArray, []);
        const expectedResult = [drawing2, drawing1];
        expect(result).toEqual(expectedResult);
    });

    it('should return reversed matching drawing array when labels are specified', () => {
        const matchingLabel = 'match';
        const nonMatchingLabel = 'dont match';
        const drawing1 = { labels: [matchingLabel] } as SvgFileContainer;
        const drawing2 = { labels: [nonMatchingLabel] } as SvgFileContainer;
        const drawing3 = { labels: [matchingLabel] } as SvgFileContainer;
        const drawing4 = { labels: [nonMatchingLabel] } as SvgFileContainer;

        const drawingArray = [drawing1, drawing2, drawing3, drawing4];
        const result = pipe.transform(drawingArray, [matchingLabel]);
        const expectedResult = [drawing3, drawing1];
        expect(result).toEqual(expectedResult);
    });
});
