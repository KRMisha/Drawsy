import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';

fdescribe('ToolRecolorService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let primaryColorSpyObj: jasmine.SpyObj<Color>;
    let secondaryColorSpyObj: jasmine.SpyObj<Color>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    let service: ToolRecolorService;

    const primaryRgbaStringValue = 'rgba(69, 69, 69, 1)';
    const secondaryRgbaStringValue = 'rgba(mao ze dong, 420, 420, 1)';

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        primaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        primaryColorSpyObj.toRgbaString.and.returnValue(primaryRgbaStringValue);

        secondaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        secondaryColorSpyObj.toRgbaString.and.returnValue(secondaryRgbaStringValue);

        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: primaryColorSpyObj,
            secondaryColor: secondaryColorSpyObj,
        });

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolRecolorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onElementClick should do nothing if mouse button is not left or right', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute']);
        service.onElementClick({ button: 69 } as MouseEvent, svgGraphicsElementSpyObj);
        expect(svgGraphicsElementSpyObj.getAttribute).not.toHaveBeenCalled();
    });

    it('#onElementClick should do nothing if fill attribute does not exist and left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'rect' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onElementClick should recolor stroke color of rect with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'rect' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Right } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onElementClick should recolor fill color of rect with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'rect' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onElementClick should recolor stroke color of polygon with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'polygon' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Right } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onElementClick should recolor fill color of polygon with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'polygon' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onElementClick should recolor stroke color of ellipse with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Right } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onElementClick should recolor fill color of ellipse with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onElementClick should recolor fill color of g element with primary color when left clicking and fill is defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onElementClick should not recolor fill color of g element with primary color when left clicking and fill not defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onElementClick should recolor stroke color of g element with primary color when left clicking and fill is defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', primaryRgbaStringValue);
    });

    it('#onElementClick should not recolor stroke color of g element with primary color when left clicking and fill not defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', primaryRgbaStringValue);
    });

    it('#onElementClick should not recolor anything of g element when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        service.onElementClick({ button: MouseButton.Right } as MouseEvent, svgGraphicsElementSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });
});
