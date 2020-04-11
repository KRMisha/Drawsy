import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionTransformService {
    constructor(private drawingService: DrawingService) {}

    getElementListTransformsCopy(elements: SVGGraphicsElement[]): SVGTransform[][] {
        const selectedElementTransformsCopy: SVGTransform[][] = [];
        for (const element of elements) {
            const elementTransforms: SVGTransform[] = [];
            for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
                const svgTransform = this.drawingService.drawingRoot.createSVGTransform();
                svgTransform.setMatrix(element.transform.baseVal.getItem(i).matrix);
                elementTransforms.push(svgTransform);
            }
            selectedElementTransformsCopy.push(elementTransforms);
        }
        return selectedElementTransformsCopy;
    }

    initializeElementTransforms(elements: SVGGraphicsElement[]): void {
        for (const element of elements) {
            const transformCount = 2;
            while (element.transform.baseVal.numberOfItems < transformCount) {
                element.transform.baseVal.appendItem(this.drawingService.drawingRoot.createSVGTransform());
            }
        }
    }
}
