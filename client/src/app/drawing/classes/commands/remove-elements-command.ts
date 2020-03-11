import { Command } from '@app/drawing/classes/commands/command';
import { ElementAndItsNeighbour } from '@app/drawing/classes/element-and-its-neighbour';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class RemoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: ElementAndItsNeighbour[]) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element.element, element.neighbour);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element.element);
        }
    }
}
