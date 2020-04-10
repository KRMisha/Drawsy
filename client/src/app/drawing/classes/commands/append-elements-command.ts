import { DrawingService } from '@app/drawing/services/drawing.service';
import { Command } from './command';

export class AppendElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: SVGGraphicsElement[]) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element);
        }
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element);
        }
    }
}
