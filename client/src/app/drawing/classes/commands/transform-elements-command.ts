import { Command } from '@app/drawing/classes/commands/command';

export class TransformElementsCommand implements Command {
    constructor(
        private elements: SVGGraphicsElement[],
        private transformListBefore: SVGTransform[][],
        private transformListAfter: SVGTransform[][]
    ) {}

    undo(): void {
        this.setElementSvgTransformList(this.transformListBefore);
    }

    redo(): void {
        this.setElementSvgTransformList(this.transformListAfter);
    }

    private setElementSvgTransformList(transformList: SVGTransform[][]): void {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].transform.baseVal.clear();
            for (const svgTransform of transformList[i]) {
                this.elements[i].transform.baseVal.appendItem(svgTransform);
            }
        }
    }
}
