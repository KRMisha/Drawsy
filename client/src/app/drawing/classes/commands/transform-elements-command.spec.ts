import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';

// tslint:disable: no-string-literal

describe('TransformElementsCommand', () => {
    let command: TransformElementsCommand;
    let baseValSpyObj: jasmine.SpyObj<SVGTransformList>;
    let elementSpyObj: jasmine.SpyObj<SVGGraphicsElement>;
    let elementsArray: SVGGraphicsElement[];

    const numberOfItemsValue = 3;
    const expectedItem = {} as SVGTransform;

    beforeEach(() => {
        baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem', 'removeItem', 'appendItem']);
        baseValSpyObj.getItem.and.returnValue(expectedItem);
        elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], {
            transform: { baseVal: baseValSpyObj },
            numberOfItems: numberOfItemsValue,
        });
        elementsArray = [elementSpyObj, elementSpyObj, elementSpyObj];
        command = new TransformElementsCommand(elementsArray);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should set the svgTransformToRedo if it has not been initialized', () => {
        command.undo();
        expect(command['svgTransformToRedo']).toBeTruthy();
    });

    it('#undo should only call remove element if svgTransformToRedo has been previously initialized', () => {
        command['svgTransformToRedo'] = expectedItem;
        command.undo();
        expect(baseValSpyObj.removeItem).toHaveBeenCalledTimes(elementsArray.length);
        expect(baseValSpyObj.getItem).not.toHaveBeenCalled();
    });

    it('#redo should append all the elements using their baseVal', () => {
        command.redo();
        expect(baseValSpyObj.appendItem).toHaveBeenCalledTimes(elementsArray.length);
    });
});
