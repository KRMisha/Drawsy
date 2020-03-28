import { MoveElementsCommand } from '@app/drawing/classes/commands/move-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Vec2 } from '@app/shared/classes/vec2';

describe('MoveElementsCommand', () => {
    let command: MoveElementsCommand;
    let drawingService: jasmine.SpyObj<DrawingService>;
    const elements = ({} as unknown) as SVGGraphicsElement[];
    const moveOffset = { x: 1, y: 1 };

    beforeEach(() => {
        drawingService = jasmine.createSpyObj('DrawingService', ['moveElementList']);
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
