import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';

describe('MoveElementsCommand', () => {
    let command: TransformElementsCommand;
    const elements = ({} as unknown) as SVGGraphicsElement[];
    // const moveOffset = { x: 1, y: 1 };

    beforeEach(() => {
        command = new TransformElementsCommand(elements);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward moveElementList call to drawingService', () => {
        command.undo();
        // expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, inverseMoveOffset);
    });

    it('#redo should forward moveElementList call to drawingService', () => {
        command.redo();
        // expect(drawingService.moveElementList).toHaveBeenCalledWith(elements, moveOffset);
    });
});
