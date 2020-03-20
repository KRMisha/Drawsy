import { Vec2 } from '@app/classes/vec2';
import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class MoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: SVGElement[], private moveOffset: Vec2) {}

    undo(): void {
        const inverseMoveOffset: Vec2 = { x: -this.moveOffset.x, y: -this.moveOffset.y };
        this.drawingService.moveElementList(this.elements, inverseMoveOffset);
    }

    redo(): void {
        this.drawingService.moveElementList(this.elements, this.moveOffset);
    }
}
