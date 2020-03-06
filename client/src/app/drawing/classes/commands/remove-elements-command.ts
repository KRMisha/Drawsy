import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class RemoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: SVGElement[]) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element);
        }
    }
}
