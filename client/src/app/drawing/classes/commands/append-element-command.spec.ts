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

    it('#undo should forward removeElement calling to drawingService', () => {
        spyOn(drawingService, 'removeElement');
        command.undo();
        expect(drawingService.removeElement).toHaveBeenCalledWith(element);
    });

    it('#redo should forward addElement calling to drawingService', () => {
        spyOn(drawingService, 'addElement');
        command.redo();
        expect(drawingService.addElement).toHaveBeenCalledWith(element);
    });
});
