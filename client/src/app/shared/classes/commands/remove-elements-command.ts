import { Command } from '@app/shared/classes/commands/command';
import { ElementAndItsNeighbor } from '@app/shared/classes/element-and-its-neighbor';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class RemoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: ElementAndItsNeighbor[]) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element.element, element.neighbor);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element.element);
        }
    }
}
