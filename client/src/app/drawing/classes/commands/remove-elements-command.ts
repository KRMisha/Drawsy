import { Command } from '@app/drawing/classes/commands/command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class RemoveElementsCommand implements Command {
    constructor(
        private drawingService: DrawingService,
        private elements: ElementSiblingPair[]
    ) {}

    undo(): void {
        for (const element of this.elements) {
            if (element.sibling !== undefined) {
                this.drawingService.addElementBefore(element.element, element.sibling);
            } else {
                this.drawingService.addElement(element.element);
            }
        }
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element.element);
        }
    }
}
