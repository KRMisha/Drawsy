import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MoveElementsCommand } from './move-elements-command';

describe('MoveElementsCommand', () => {
    let command: MoveElementsCommand;
    let drawingService: jasmine.SpyObj<DrawingService>;
    let elements: SVGElement[];
    let moveValue: Vec2;

    beforeEach(() => {
        elements = ({} as unknown) as SVGElement[];
        drawingService = jasmine.createSpyObj('DrawingService', ['moveElementList']);
        moveValue = { x: 1, y: 1 };
        command = new MoveElementsCommand(drawingService, elements, moveValue);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward moveElementList call to drawingService', () => {
        command.undo();
        const inverseMoveValue: Vec2 = { x: -moveValue.x, y: -moveValue.y };
        expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, inverseMoveValue);
    });

    it('#redo should forward moveElementList call to drawingService', () => {
        command.redo();
        expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, moveValue);
    });
});
