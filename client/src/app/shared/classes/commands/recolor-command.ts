import { Command } from '@app/shared/classes/commands/command';

export class RecolorCommand implements Command {
    constructor(
        private element: SVGElement,
        private attributesBefore: Map<string, string | undefined>,
        private attributesAfter: Map<string, string | undefined>
    ) {}

    undo(): void {
        this.applyAttributeMap(this.attributesBefore);
    }

    redo(): void {
        this.applyAttributeMap(this.attributesAfter);
    }

    private applyAttributeMap(map: Map<string, string | undefined>): void {
        map.forEach((value: string | undefined, key: string) => {
            if (value) {
                this.element.setAttribute(key, value);
            } else {
                this.element.removeAttribute(key);
            }
        });
    }
}
