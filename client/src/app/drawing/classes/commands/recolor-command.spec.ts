import { RecolorCommand } from '@app/drawing/classes/commands/recolor-command';

describe('RecolorCommand', () => {
    let svgElementSpyObj: jasmine.SpyObj<SVGGraphicsElement>;
    let command: RecolorCommand;

    const strokeBefore = 'strokeBefore';
    const fillBefore = 'fillBefore';
    const strokeAfter = 'strokeAfter';
    const fillAfter = 'fillAfter';

    beforeEach(() => {
        svgElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['setAttribute']);
        command = new RecolorCommand(svgElementSpyObj, strokeBefore, fillBefore, strokeAfter, fillAfter);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should change the element attributes to attributesBefore if attribute is not undefined', () => {
        command.undo();
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('stroke', strokeBefore);
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('fill', fillBefore);
    });

    it('#undo should not change the element attributes to attributesBefore if attribute is undefined', () => {
        command = new RecolorCommand(svgElementSpyObj, undefined, undefined, strokeAfter, fillAfter);
        command.undo();
        expect(svgElementSpyObj.setAttribute).not.toHaveBeenCalled();
        expect(svgElementSpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#redo should change the element attributes to attributesAfter if attribute is not undefined', () => {
        command.redo();
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('stroke', strokeAfter);
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('fill', fillAfter);
    });

    it('#redo should not change the element attributes to attributesAfter if attribute is undefined', () => {
        command = new RecolorCommand(svgElementSpyObj, strokeBefore, fillBefore, undefined, undefined);
        command.redo();
        expect(svgElementSpyObj.setAttribute).not.toHaveBeenCalled();
        expect(svgElementSpyObj.setAttribute).not.toHaveBeenCalled();
    });
});
