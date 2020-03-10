import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ElementAndItsNeighbour } from '../element-and-its-neighbour';

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
