import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { DrawingService } from '@app/drawing/services/drawing.service';

describe('RemoveElementCommand', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    const elementSiblingPair = {} as ElementSiblingPair;
    const elements = [elementSiblingPair, elementSiblingPair, elementSiblingPair];
    let command: RemoveElementsCommand;

    beforeEach(() => {
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
            expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(element.element, element.sibling);
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
