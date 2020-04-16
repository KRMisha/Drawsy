import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
import { DrawingService } from '@app/drawing/services/drawing.service';

describe('AddElementCommand', () => {
    let command: AddElementCommand;
    let drawingService: jasmine.SpyObj<DrawingService>;
    let element: SVGGraphicsElement;

    beforeEach(() => {
        element = ({} as unknown) as SVGGraphicsElement;
        drawingService = jasmine.createSpyObj('DrawingService', ['removeElement', 'addElement']);
        command = new AddElementCommand(drawingService, element);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward removeElement call to drawingService', () => {
        command.undo();
        expect(drawingService.removeElement).toHaveBeenCalledWith(element);
    });

    it('#redo should forward addElement call to drawingService', () => {
        command.redo();
        expect(drawingService.addElement).toHaveBeenCalledWith(element);
    });
});
