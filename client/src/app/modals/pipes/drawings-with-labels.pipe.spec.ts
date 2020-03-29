import { DrawingsWithLabelsPipe } from './drawings-with-labels.pipe';

describe('DrawingsWithLabelsPipe', () => {
    it('create an instance', () => {
        const pipe = new DrawingsWithLabelsPipe();
        expect(pipe).toBeTruthy();
    });
});
