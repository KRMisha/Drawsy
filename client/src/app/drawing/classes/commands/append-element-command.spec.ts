import { DrawingService } from '@app/drawing/services/drawing.service';
import { AppendElementCommand } from './append-element-command';

describe('AppendElementCommand', () => {
    let command: AppendElementCommand;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let svgElement: SVGElement;

    beforeEach(() => {
        svgElement = ({} as unknown) as SVGElement;
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
            'removeElement',
            'addElement'
        ]);
        command = new AppendElementCommand(drawingServiceSpyObj, svgElement);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should forward removeElement calling to drawingService', () => {
        command.undo();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledWith(svgElement);
    });

    it('#redo should forward addElement calling to drawingService', () => {
        command.redo();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(svgElement);
    });
});
