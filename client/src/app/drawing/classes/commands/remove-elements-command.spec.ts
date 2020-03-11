import { ElementAndItsNeighbour } from '@app/drawing/classes/element-and-its-neighbour';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RemoveElementsCommand } from './remove-elements-command';

describe('RemoveElementCommand', () => {
    let drawingService: DrawingService;
    let elements: ElementAndItsNeighbour[];
    let command: RemoveElementsCommand;

    beforeEach(() => {
        elements = [{} as ElementAndItsNeighbour, {} as ElementAndItsNeighbour] as ElementAndItsNeighbour[];
        drawingService = {
            addElement: (element: SVGElement, neighbour: SVGElement) => {
                return;
            },
            removeElement: (element: SVGElement) => {
                return;
            },
        } as DrawingService;
        command = new RemoveElementsCommand(drawingService, elements);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should call addElement of drawingService with good parameters', () => {
        spyOn(drawingService, 'addElement');
        command.undo();
        expect(drawingService.addElement).toHaveBeenCalledTimes(elements.length);
        for (const element of elements) {
            expect(drawingService.addElement).toHaveBeenCalledWith(element.element, element.neighbour);
        }
    });

    it('#redo should call removeElement of drawingService with good parameters', () => {
        spyOn(drawingService, 'removeElement');
        command.redo();
        expect(drawingService.removeElement).toHaveBeenCalledTimes(elements.length);
        for (const element of elements) {
            expect(drawingService.removeElement).toHaveBeenCalledWith(element.element);
        }
    });
});
