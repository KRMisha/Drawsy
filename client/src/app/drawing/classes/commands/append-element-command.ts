import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class AppendElementCommand implements Command {
    constructor(private drawingService: DrawingService, private element: SVGElement) {}

    undo(): void {
        this.drawingService.removeElement(this.element);
    }

    redo(): void {
        this.drawingService.addElement(this.element);
    }
}
