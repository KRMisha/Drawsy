import { AddElementsClipboardCommand } from '@app/drawing/classes/commands/add-elements-clipboard-command';
import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('AddElementsClipboardCommand', () => {
    let addElementsClipboardCommand: AddElementsClipboardCommand;
    let clipboardServiceStub: ClipboardService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let elements: SVGGraphicsElement[];

    const expectedOffset = 5;
    const elementStub = {} as SVGGraphicsElement;
    beforeEach(() => {
        clipboardServiceStub = {
            clipboardPositionOffset: 0,
            duplicationPositionOffset: 0,
        } as ClipboardService;
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['removeElement', 'addElement']);

        elements = ({} as unknown) as SVGGraphicsElement[];
        addElementsClipboardCommand = new AddElementsClipboardCommand(
            clipboardServiceStub,
            drawingServiceSpyObj,
            elements,
            expectedOffset,
            expectedOffset,
            expectedOffset,
            expectedOffset
        );

        addElementsClipboardCommand['elements'] = [elementStub, elementStub, elementStub];
    });

    it('should create an instance', () => {
        expect(addElementsClipboardCommand).toBeTruthy();
    });

    it('#undo should remove all the elements from the drawingService and set the clipboard service offsets to the ones from before', () => {
        addElementsClipboardCommand.undo();

        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledTimes(3);
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledWith(elementStub);
        expect(clipboardServiceStub.clipboardPositionOffset).toEqual(expectedOffset);
        expect(clipboardServiceStub.duplicationPositionOffset).toEqual(expectedOffset);
    });

    it('#redo should add all the elements to the drawingService and set the clipboard service offsets to the ones from after', () => {
        addElementsClipboardCommand.redo();

        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledTimes(3);
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(elementStub);
        expect(clipboardServiceStub.clipboardPositionOffset).toEqual(expectedOffset);
        expect(clipboardServiceStub.duplicationPositionOffset).toEqual(expectedOffset);
    });
});
