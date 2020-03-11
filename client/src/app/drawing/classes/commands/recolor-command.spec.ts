import { RecolorCommand } from './recolor-command';

describe('RecolorCommand', () => {
    let element: SVGElement;
    let attributesBefore: Map<string, string | undefined>;
    let attributesAfter: Map<string, string | undefined>;
    let command: RecolorCommand;

    beforeEach(() => {
        element = {
            setAttribute: (key: string, value: string) => {
                return;
            },
            removeAttribute: (key: string) => {
                return;
            },
        } as SVGElement;
        attributesBefore = new Map<string, string | undefined>();
        attributesBefore.set('color', 'white');
        attributesBefore.set('transparency', undefined);
        attributesAfter = new Map<string, string | undefined>();
        attributesAfter.set('color', 'black');
        attributesAfter.set('opacity', undefined);
        command = new RecolorCommand(element, attributesBefore, attributesAfter);
    });

    it('should create an instance', () => {
        expect(command).toBeTruthy();
    });

    it('#undo should change the element attributes to attributesBefore', () => {
        spyOn(element, 'setAttribute');
        spyOn(element, 'removeAttribute');
        command.undo();
        expect(element.setAttribute).toHaveBeenCalledWith('color', attributesBefore.get('color'));
        expect(element.removeAttribute).toHaveBeenCalledWith('transparency');
    });

    it('#redo should change the element attributes to attributesAfter', () => {
        spyOn(element, 'setAttribute');
        spyOn(element, 'removeAttribute');
        command.redo();
        expect(element.setAttribute).toHaveBeenCalledWith('color', attributesAfter.get('color'));
        expect(element.removeAttribute).toHaveBeenCalledWith('opacity');
    });
});
