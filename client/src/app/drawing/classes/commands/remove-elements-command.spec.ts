import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementAndItsNeighbor } from '@app/shared/classes/element-and-its-neighbor';
import { DrawingService } from '@app/drawing/services/drawing.service';

describe('RemoveElementCommand', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let elements: ElementAndItsNeighbor[];
    let command: RemoveElementsCommand;

    beforeEach(() => {
        elements = [{} as ElementAndItsNeighbor, {} as ElementAndItsNeighbor] as ElementAndItsNeighbor[];
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement']);
        command = new RemoveElementsCommand(drawingServiceSpyObj, elements);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should call addElement of drawingService with good parameters', () => {
        command.undo();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledTimes(elements.length);
        for (const element of elements) {
            expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(element.element, element.neighbor);
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
