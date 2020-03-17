import { DrawingService } from '@app/drawing/services/drawing.service';
import { AppendElementCommand } from './append-element-command';

describe('AppendElementCommand', () => {
    let command: AppendElementCommand;
    let drawingService: jasmine.SpyObj<DrawingService>;
    let element: SVGElement;

    beforeEach(() => {
        element = ({} as unknown) as SVGElement;
        drawingService = jasmine.createSpyObj('DrawingService', ['removeElement', 'addElement']);
        command = new AppendElementCommand(drawingService, element);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward removeElement call to drawingService', () => {
        command.undo();
        expect(drawingService.removeElement).toHaveBeenCalledWith(element);
    });

    it('#redo should forward addElement calling to drawingService', () => {
        command.redo();
        expect(drawingService.addElement).toHaveBeenCalledWith(element);
    });
});
