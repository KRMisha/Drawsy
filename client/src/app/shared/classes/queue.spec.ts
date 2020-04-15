import { Queue } from './queue';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('Queue', () => {
    let queue: Queue<number>;
    const initialCount = 0;
    const initialLowestCount = 0;

    beforeEach(() => {
        queue = new Queue();
        queue['count'] = initialCount;
        queue['lowestCount'] = initialLowestCount;
        queue['storage'] = [];
    });

    it('should create an instance', () => {
        expect(new Queue()).toBeTruthy();
    });

    it('#enqueue should early return if the specified value is undefined', () => {
        queue.enqueue((undefined as unknown) as number);

        expect(queue['count']).toEqual(initialCount);
        expect(queue['storage'][initialCount]).toBeUndefined();
    });

    it('#enqueue should add the specified value to storage and increment the count if the value is valid', () => {
        const expectedValue = 1;
        queue.enqueue(expectedValue);

        expect(queue['count']).toEqual(initialCount + 1);
        expect(queue['storage'][initialCount]).toEqual(expectedValue);
    });

    it('#dequeue should return undefined if the count is equal to the lowestCount', () => {
        const result = queue.dequeue();

        expect(result).toBeUndefined();
    });

    it('#dequeue should return and delete the value stored at the lowestCount index if the queue is not empty', () => {
        queue['count'] = 1;
        const storedValue = 2;
        queue['storage'] = [storedValue];
        const result = queue.dequeue();

        expect(queue['storage'][initialLowestCount]).toBeUndefined();
        expect(result).toEqual(storedValue);
    });

    it('#peek should early return undefined if the count is equal to the lowestCount', () => {
        const result = queue.peek();

        expect(result).toBeUndefined();
    });

    it('#peek should return the value stored at the lowestCount index if the queue is not empty', () => {
        queue['count'] = 1;
        const storedValue = 2;
        queue['storage'] = [storedValue];
        const result = queue.peek();

        expect(queue['storage'][initialLowestCount]).toEqual(storedValue);
        expect(result).toEqual(storedValue);
    });

    it('#isEmpty should return true if the count is equal to the lowestCount', () => {
        const result = queue.isEmpty();

        expect(result).toEqual(true);
    });

    it('#size should return the size of the queue', () => {
        const count = 10;
        queue['count'] = count;
        const lowestCount = 4;
        queue['lowestCount'] = lowestCount;
        const expectedSize = count - lowestCount;
        const result = queue.size();

        expect(result).toEqual(expectedSize);
    });
});
