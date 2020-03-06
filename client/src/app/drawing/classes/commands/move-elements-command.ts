import { Vec2 } from '@app/classes/vec2';
import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class MoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: SVGElement[], private moveValue: Vec2) {}

    undo(): void {
        const inverseMoveValue: Vec2 = { x: -this.moveValue.x, y: -this.moveValue.y };
        this.drawingService.moveElementList(this.elements, inverseMoveValue);
    }

    redo(): void {
        this.drawingService.moveElementList(this.elements, this.moveValue);
    }
}
