export class Queue<T> {
    private count = 0;
    private lowestCount = 0;
    private storage: T[] = [];

    enqueue(value: T): void {
        if (value === undefined) {
            return;
        }
        this.storage[this.count++] = value;
    }

    dequeue(): T | undefined {
        if (this.count === this.lowestCount) {
            return undefined;
        }
        const result = this.storage[this.lowestCount];
        delete this.storage[this.lowestCount++];
        return result;
    }

    peek(): T | undefined {
        if (this.count === this.lowestCount) {
            return undefined;
        }
        return this.storage[this.lowestCount];
    }

    isEmpty(): boolean {
        return this.lowestCount === this.count;
    }

    size(): number {
        return this.count - this.lowestCount;
    }
}
