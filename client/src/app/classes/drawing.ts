import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';

export class Drawing {
    private _elements: SVGElement[] = []; // tslint:disable-line: variable-name
    get elements(): SVGElement[] {
        return this._elements;
    }

    dimensions: Vec2 = { x: 512, y: 512 };
    backgroundColor = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    addElement(element: SVGElement): void {
        this.elements.push(element);
    }

    removeElement(element: SVGElement): boolean {
        const elementToRemoveIndex = this.elements.indexOf(element, 0);
        if (elementToRemoveIndex > -1) {
            this.elements.splice(elementToRemoveIndex, 1);
            return true;
        }
        return false;
    }

    clearElements(): void {
        this.elements.length = 0;
    }

    hasElements(): boolean {
        return this.elements.length > 0;
    }
}
