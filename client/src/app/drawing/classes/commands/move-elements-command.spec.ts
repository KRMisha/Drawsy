import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MoveElementsCommand } from './move-elements-command';

describe('MoveElementsCommand', () => {
    let command: MoveElementsCommand;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let svgElement: SVGElement[];
    let moveValue: Vec2;

    beforeEach(() => {
        svgElement = ({} as unknown) as SVGElement[];
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
            'moveElementList'
        ]);
        moveValue = { x: 1, y: 1 };
        command = new MoveElementsCommand(drawingServiceSpyObj, svgElement, moveValue);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward moveElementList calling to drawingService', () => {
        command.undo();
        const inverseMoveValue: Vec2 = { x: -moveValue.x, y: -moveValue.y };
        expect(drawingServiceSpyObj.moveElementList).toHaveBeenCalledWith(svgElement, inverseMoveValue);
    });

    it('#redo should forward moveElementList calling to drawingService', () => {
        command.redo();
        expect(drawingServiceSpyObj.moveElementList).toHaveBeenCalledWith(svgElement, moveValue);
    });
});
