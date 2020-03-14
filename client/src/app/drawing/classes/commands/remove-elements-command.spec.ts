import { ElementAndItsNeighbour } from '@app/drawing/classes/element-and-its-neighbour';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RemoveElementsCommand } from './remove-elements-command';

describe('RemoveElementCommand', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let elements: ElementAndItsNeighbour[];
    let command: RemoveElementsCommand;

    beforeEach(() => {
        elements = [{} as ElementAndItsNeighbour, {} as ElementAndItsNeighbour] as ElementAndItsNeighbour[];
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
            'addElement',
            'removeElement'
        ]);
        command = new RemoveElementsCommand(drawingServiceSpyObj, elements);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should call addElement of drawingService with good parameters', () => {
        command.undo();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledTimes(elements.length);
        for (const element of elements) {
            expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(element.element, element.neighbour);
        }
    });

    it('#redo should call removeElement of drawingService with good parameters', () => {
        command.redo();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledTimes(elements.length);
        for (const element of elements) {
            expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledWith(element.element);
        }
    });
});
