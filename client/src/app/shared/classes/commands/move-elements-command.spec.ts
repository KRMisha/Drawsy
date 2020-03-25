import { Vec2 } from '@app/shared/classes/vec2';
import { MoveElementsCommand } from '@app/shared/classes/commands/move-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';

describe('MoveElementsCommand', () => {
    let command: MoveElementsCommand;
    let drawingService: jasmine.SpyObj<DrawingService>;
    let elements: SVGElement[];
    let moveOffset: Vec2;

    beforeEach(() => {
        elements = ({} as unknown) as SVGElement[];
        drawingService = jasmine.createSpyObj('DrawingService', ['moveElementList']);
        moveOffset = { x: 1, y: 1 };
        command = new MoveElementsCommand(drawingService, elements, moveOffset);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward moveElementList call to drawingService', () => {
        command.undo();
        const inverseMoveOffset: Vec2 = { x: -moveOffset.x, y: -moveOffset.y };
        expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, inverseMoveOffset);
    });

    it('#redo should forward moveElementList call to drawingService', () => {
        command.redo();
        expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, moveOffset);
    });
});
