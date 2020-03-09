import { Command } from './command';

export class RecolorCommand implements Command {
    constructor(
        private element: SVGElement,
        private attributesBefore: Map<string, string | undefined>,
        private attributesAfter: Map<string, string | undefined>,
    ) {}

    undo(): void {
        this.applyAtrributeMap(this.attributesBefore);
    }

    redo(): void {
        this.applyAtrributeMap(this.attributesAfter);
    }

    private applyAtrributeMap(map: Map<string, string | undefined>): void {
        map.forEach((value: string | undefined, key: string) => {
            if (value) {
                this.element.setAttribute(key, value);
            } else {
                this.element.removeAttribute(key);
            }
        });
    }
}
