import { DrawingService } from '@app/drawing/services/drawing.service';
import { AppendElementCommand } from './append-element-command';

describe('AppendElementCommand', () => {
    let command: AppendElementCommand;
    let drawingService: DrawingService;
    let svgElement: SVGElement;

    beforeEach(() => {
        svgElement = ({} as unknown) as SVGElement;
        drawingService = {
            removeElement: (element: SVGElement) => {
                return;
            },
            addElement: (element: SVGElement) => {
                return;
            },
        } as DrawingService;
        command = new AppendElementCommand(drawingService, svgElement);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward removeElement calling to drawingService', () => {
        spyOn(drawingService, 'removeElement');
        command.undo();
        expect(drawingService.removeElement).toHaveBeenCalledWith(svgElement);
    });

    it('#redo should forward addElement calling to drawingService', () => {
        spyOn(drawingService, 'addElement');
        command.redo();
        expect(drawingService.addElement).toHaveBeenCalledWith(svgElement);
    });
});
