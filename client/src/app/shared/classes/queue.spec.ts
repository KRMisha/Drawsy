import { Queue } from '@app/shared/classes/queue';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('Queue', () => {
    let queue: Queue<number>;
    const initialCount = 0;
    const initialFirstIndex = 0;
    const storedValue = 2;

    beforeEach(() => {
        queue = new Queue();
        queue['firstIndex'] = initialFirstIndex;
        queue['elements'] = [];
    });

    it('should create an instance', () => {
        expect(new Queue()).toBeTruthy();
    });

    it('#enqueue should early return if the specified value is undefined', () => {
        queue.enqueue((undefined as unknown) as number);

        expect(queue['elements'].length).toEqual(initialCount);
        expect(queue['elements'][initialCount]).toBeUndefined();
    });

    it('#enqueue should add the specified value to elements and increment the count if the value is valid', () => {
        const expectedValue = 1;
        queue.enqueue(expectedValue);

        expect(queue['elements'].length).toEqual(initialCount + 1);
        expect(queue['elements'][initialCount]).toEqual(expectedValue);
    });

    it('#dequeue should return undefined if the count is equal to the firstIndex', () => {
        const result = queue.dequeue();

        expect(result).toBeUndefined();
    });

    it('#dequeue should return and delete the value stored at the firstIndex index if the queue is not empty', () => {
        queue['elements'] = [storedValue];
        const result = queue.dequeue();

        expect(queue['elements'][initialFirstIndex]).toBeUndefined();
        expect(result).toEqual(storedValue);
    });

    it('#peek should early return undefined if the count is equal to the firstIndex', () => {
        const result = queue.peek();

        expect(result).toBeUndefined();
    });

    it('#peek should return the value stored at the firstIndex index if the queue is not empty', () => {
        queue['elements'] = [storedValue];
        const result = queue.peek();

        expect(queue['elements'][initialFirstIndex]).toEqual(storedValue);
        expect(result).toEqual(storedValue);
    });

    it('#isEmpty should return true if the count is equal to the firstIndex', () => {
        const result = queue.isEmpty();

        expect(result).toEqual(true);
    });

    it('#size should return the size of the queue', () => {
        queue['elements'] = [storedValue, storedValue, storedValue, storedValue, storedValue];
        const elementsLength = queue['elements'].length;
        const firstIndex = 1;
        queue['firstIndex'] = firstIndex;
        const expectedSize = elementsLength - firstIndex;
        const result = queue.size();

        expect(result).toEqual(expectedSize);
    });
});
