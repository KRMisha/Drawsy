import { Command } from '@app/drawing/classes/commands/command';

export class MoveElementsCommand implements Command {
    private svgTransform: SVGTransform;
    constructor(private elements: SVGGraphicsElement[]) {}

    undo(): void {
        for (const element of this.elements) {
            const transformIndex = element.transform.baseVal.numberOfItems - 1;
            if (this.svgTransform === undefined) {
                this.svgTransform = element.transform.baseVal.getItem(transformIndex);
            }
            element.transform.baseVal.removeItem(transformIndex);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            element.transform.baseVal.appendItem(this.svgTransform);
        }
    }
}
