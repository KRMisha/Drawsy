import { Command } from '@app/drawing/classes/commands/command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Vec2 } from '@app/shared/classes/vec2';

export class MoveElementsCommand implements Command {
    constructor(private drawingService: DrawingService, private elements: SVGGraphicsElement[], private moveOffset: Vec2) {}

    undo(): void {
        const inverseMoveOffset: Vec2 = { x: -this.moveOffset.x, y: -this.moveOffset.y };
        this.drawingService.moveElementList(this.elements, inverseMoveOffset);
    }

    redo(): void {
        this.drawingService.moveElementList(this.elements, this.moveOffset);
    }
}
