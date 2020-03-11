import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MoveElementsCommand } from './move-elements-command';

describe('MoveElementsCommand', () => {
    let command: MoveElementsCommand;
    let drawingService: DrawingService;
    let svgElement: SVGElement[];
    let moveValue: Vec2;

    beforeEach(() => {
        svgElement = ({} as unknown) as SVGElement[];
        drawingService = {
            moveElementList: (elements: SVGElement[], move: Vec2) => {
                return;
            },
        } as DrawingService;
        moveValue = { x: 1, y: 1 };
        command = new MoveElementsCommand(drawingService, svgElement, moveValue);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward moveElementList calling to drawingService', () => {
        spyOn(drawingService, 'moveElementList');
        command.undo();
        const inverseMoveValue: Vec2 = { x: -moveValue.x, y: -moveValue.y };
        expect(drawingService.moveElementList).toHaveBeenCalledWith(svgElement, inverseMoveValue);
    });

    it('#redo should forward moveElementList calling to drawingService', () => {
        spyOn(drawingService, 'moveElementList');
        command.redo();
        expect(drawingService.moveElementList).toHaveBeenCalledWith(svgElement, moveValue);
    });
});
