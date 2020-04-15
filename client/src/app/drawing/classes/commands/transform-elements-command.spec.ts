import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';

// tslint:disable: no-any

describe('TransformElementsCommand', () => {
    let command: TransformElementsCommand;
    let elementSpyObj: jasmine.SpyObj<SVGGraphicsElement>;
    let elementsArray: SVGGraphicsElement[];
    let baseValSpyObj: jasmine.SpyObj<SVGTransformList>;

    const transformListBefore: SVGTransform[][] = [];
    const transformListAfter: SVGTransform[][] = [];

    const numberOfTransforms = 5;
    beforeEach(() => {
        baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['clear', 'appendItem']);
        const transformSpyObj = jasmine.createSpyObj('SVGAnimatedTransformList', [], { baseVal: baseValSpyObj });
        elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], {
            transform: transformSpyObj,
        });
        elementsArray = [elementSpyObj, elementSpyObj, elementSpyObj];
        for (let i = 0; i < numberOfTransforms; i++) {
            transformListBefore[i] = [];
            transformListAfter[i] = [];
            for (let j = 0; j < numberOfTransforms; j++) {
                transformListBefore[i][j] = {} as SVGTransform;
                transformListAfter[i][j] = {} as SVGTransform;
            }
        }
        command = new TransformElementsCommand(elementsArray, transformListBefore, transformListAfter);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should set the elements SvgTransformList to the list before the command', () => {
        const setElementSvgTransformListSpy = spyOn<any>(command, 'setElementSvgTransformList').and.callThrough();
        command.undo();
        expect(setElementSvgTransformListSpy).toHaveBeenCalledWith(transformListBefore);
        expect(baseValSpyObj.clear).toHaveBeenCalledTimes(elementsArray.length);
        expect(baseValSpyObj.appendItem).toHaveBeenCalledTimes(elementsArray.length * numberOfTransforms);
    });

    it('#redo should set the elements SvgTransformList to the list after the command', () => {
        const setElementSvgTransformListSpy = spyOn<any>(command, 'setElementSvgTransformList').and.callThrough();
        command.redo();
        expect(setElementSvgTransformListSpy).toHaveBeenCalledWith(transformListAfter);
        expect(baseValSpyObj.clear).toHaveBeenCalledTimes(elementsArray.length);
        expect(baseValSpyObj.appendItem).toHaveBeenCalledTimes(elementsArray.length * numberOfTransforms);
    });

});
