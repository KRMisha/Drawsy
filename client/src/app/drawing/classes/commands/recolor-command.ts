import { Command } from './command';

export class RecolorCommand implements Command {
    constructor(
        private element: SVGElement,
        private attributesBefore: Map<string, string | null>,
        private attributesAfter: Map<string, string | null>,
    ) {}

    undo(): void {
        this.applyAtrributeMap(this.attributesBefore);
    }

    redo(): void {
        this.applyAtrributeMap(this.attributesAfter);
    }

    private applyAtrributeMap(map: Map<string, string | null>): void {
        map.forEach((value: string | null, key: string) => {
            if (value) {
                this.element.setAttribute(key, value);
            } else {
                this.element.removeAttribute(key);
            }
        });
    }
}
