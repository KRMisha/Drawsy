import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RecolorCommand } from '@app/drawing/classes/commands/recolor-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';

describe('ToolRecolorService', () => {
    let service: ToolRecolorService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let primaryColorSpyObj: jasmine.SpyObj<Color>;
    let secondaryColorSpyObj: jasmine.SpyObj<Color>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    const primaryRgbaStringValue = 'rgba(69, 69, 69, 1)';
    const secondaryRgbaStringValue = 'rgba(mao ze dong, 420, 420, 1)';

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['findDrawingChildElement']);

        primaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        primaryColorSpyObj.toRgbaString.and.returnValue(primaryRgbaStringValue);

        secondaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        secondaryColorSpyObj.toRgbaString.and.returnValue(secondaryRgbaStringValue);

        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: primaryColorSpyObj,
            secondaryColor: secondaryColorSpyObj,
        });

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolRecolorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should do nothing if mouse button is not left or right', () => {
        service.onMouseDown({ button: 69 } as MouseEvent);
        expect(drawingServiceSpyObj.findDrawingChildElement).not.toHaveBeenCalled();
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if the element returned by the drawingService is undefined', () => {
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(undefined);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.findDrawingChildElement).toHaveBeenCalled();
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#onMouseDown should recolor stroke color of rect with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'rect' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onMouseDown should recolor fill color of rect with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'rect' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should recolor stroke color of polygon with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'polygon' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onMouseDown should recolor fill color of polygon with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'polygon' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should recolor stroke color of ellipse with secondary color when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', secondaryRgbaStringValue);
    });

    it('#onMouseDown should recolor fill color of ellipse with primary color when left clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should not recolor anything if the attributeValue is none', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('none');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should not recolor anything if the attributeValue is null', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'ellipse' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should recolor fill color of g element with primary color when left clicking and fill is defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should not recolor fill color of g element with primary color when left clicking and fill not defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'fill', primaryRgbaStringValue);
    });

    it('#onMouseDown should recolor stroke color of g element with primary color when left clicking and fill is defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue('69');
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', primaryRgbaStringValue);
    });

    it('#onMouseDown should not recolor stroke color of g element with primary color when left clicking and fill not defined', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        svgGraphicsElementSpyObj.getAttribute.and.returnValue(null);
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalledWith(svgGraphicsElementSpyObj, 'stroke', primaryRgbaStringValue);
    });

    it('#onMouseDown should not recolor anything of g element when right clicking', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onMouseDown should add a new RecolorCommand when the stroke or the fill has changed', () => {
        const svgGraphicsElementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getAttribute'], { nodeName: 'g' });
        let firstCheck = true;
        svgGraphicsElementSpyObj.getAttribute.and.callFake((attribute: string) => {
            switch (attribute) {
                case 'stroke':
                    if (firstCheck) {
                        firstCheck = false;
                        return '10';
                    }
                    return '20';
                case 'fill':
                    return 'none';
                default:
                    return undefined;
            }
        });
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(svgGraphicsElementSpyObj);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new RecolorCommand(svgGraphicsElementSpyObj, '10', 'none', '20', 'none')
        );
    });
});
