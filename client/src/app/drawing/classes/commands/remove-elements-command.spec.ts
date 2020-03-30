import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { ElementSiblingPair } from '@app/drawing/classes/element-sibling-pair';
import { DrawingService } from '@app/drawing/services/drawing.service';

describe('RemoveElementCommand', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    const elementStub = {} as SVGGraphicsElement;
    const siblingStub = {} as SVGGraphicsElement;
    const elementWithSibling: ElementSiblingPair = {element: elementStub, sibling: siblingStub};
    const elementWithoutSibling: ElementSiblingPair = {element: elementStub, sibling: undefined};
    const elements = [elementWithSibling, elementWithoutSibling, elementWithSibling];
    let command: RemoveElementsCommand;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'addElementBefore', 'removeElement']);
        command = new RemoveElementsCommand(drawingServiceSpyObj, elements);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should add element before if it has a sibling and only add the element otherwise', () => {
        command.undo();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledTimes(1);
        expect(drawingServiceSpyObj.addElementBefore).toHaveBeenCalledTimes(2);
    });

    it('#redo should remove the element from the drawing', () => {
        command.redo();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledTimes(elements.length);
    });
});
