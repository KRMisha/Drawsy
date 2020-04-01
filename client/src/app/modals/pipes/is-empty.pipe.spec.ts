import { IsEmptyPipe } from '@app/modals/pipes/is-empty.pipe';

describe('IsEmptyPipe', () => {
    let pipe: IsEmptyPipe;

    beforeEach(() => {
        pipe = new IsEmptyPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return true if the array is empty', () => {
        const itemArray: number[] = [];
        const pipeResult = pipe.transform(itemArray);
        expect(pipeResult).toEqual(true);
    });

    it('should return false if the array is not empty', () => {
        const item = 0;
        const itemArray = [item, item];
        const pipeResult = pipe.transform(itemArray);
        expect(pipeResult).toEqual(false);
    });
});
