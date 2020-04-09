export class ToolSelectionTransformService {
    static getElementListTransformsCopy(elements: SVGGraphicsElement[], drawingRoot: SVGSVGElement): SVGTransform[][] {
        const selectedElementTransformsCopy: SVGTransform[][] = [];
        for (const element of elements) {
            const elementTransforms: SVGTransform[] = [];
            for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
                const svgTransform = drawingRoot.createSVGTransform();
                svgTransform.setMatrix(element.transform.baseVal.getItem(i).matrix);
                elementTransforms.push(svgTransform);
            }
            selectedElementTransformsCopy.push(elementTransforms);
        }
        return selectedElementTransformsCopy;
    }

    static initializeElementTransforms(elements: SVGGraphicsElement[], drawingRoot: SVGSVGElement): void {
        for (const element of elements) {
            const transformCount = 2;
            while (element.transform.baseVal.numberOfItems < transformCount) {
                element.transform.baseVal.appendItem(drawingRoot.createSVGTransform());
            }
        }
    }
}
