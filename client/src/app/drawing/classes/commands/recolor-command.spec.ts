import { RecolorCommand } from '@app/drawing/classes/commands/recolor-command';

describe('RecolorCommand', () => {
    let svgElementSpyObj: jasmine.SpyObj<SVGElement>;
    let attributesBefore: Map<string, string | undefined>;
    let attributesAfter: Map<string, string | undefined>;
    let command: RecolorCommand;

    beforeEach(() => {
        svgElementSpyObj = jasmine.createSpyObj('SVGElement', ['setAttribute', 'removeAttribute']);
        attributesBefore = new Map<string, string | undefined>();
        attributesBefore.set('color', 'white');
        attributesBefore.set('transparency', undefined);
        attributesAfter = new Map<string, string | undefined>();
        attributesAfter.set('color', 'black');
        attributesAfter.set('opacity', undefined);
        command = new RecolorCommand(svgElementSpyObj, attributesBefore, attributesAfter);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should change the element attributes to attributesBefore', () => {
        command.undo();
        // tslint:disable-next-line: no-non-null-assertion
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('color', attributesBefore.get('color')!);
        expect(svgElementSpyObj.removeAttribute).toHaveBeenCalledWith('transparency');
    });

    it('#redo should change the element attributes to attributesAfter', () => {
        command.redo();
        // tslint:disable-next-line: no-non-null-assertion
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('color', attributesAfter.get('color')!);
        expect(svgElementSpyObj.removeAttribute).toHaveBeenCalledWith('opacity');
    });
});
