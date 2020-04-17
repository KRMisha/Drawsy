export class Queue<T> {
    private firstIndex = 0;
    private elements: T[] = [];

    enqueue(value: T): void {
        if (value === undefined) {
            return;
        }
        this.elements.push(value);
    }

    dequeue(): T | undefined {
        if (this.firstIndex >= this.elements.length) {
            return undefined;
        }

        const result = this.elements[this.firstIndex];
        delete this.elements[this.firstIndex++];
        return result;
    }

    peek(): T | undefined {
        if (this.firstIndex >= this.elements.length) {
            return undefined;
        }

        return this.elements[this.firstIndex];
    }

    isEmpty(): boolean {
        return this.firstIndex === this.elements.length;
    }

    size(): number {
        return this.elements.length - this.firstIndex;
    }
}
