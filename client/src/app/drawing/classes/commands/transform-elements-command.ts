import { Command } from '@app/drawing/classes/commands/command';

export class TransformElementsCommand implements Command {
    private svgTransformToRedo: SVGTransform;

    constructor(private elements: SVGGraphicsElement[]) {}

    undo(): void {
        for (const element of this.elements) {
            const lastTransformIndex = element.transform.baseVal.numberOfItems - 1;
            if (this.svgTransformToRedo === undefined) {
                this.svgTransformToRedo = element.transform.baseVal.getItem(lastTransformIndex);
            }
            element.transform.baseVal.removeItem(lastTransformIndex);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            element.transform.baseVal.appendItem(this.svgTransformToRedo);
        }
    }
}
