import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolFillService } from '@app/tools/services/tool-fill.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

fdescribe('ToolFillService', () => {
    let rendererSpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactorySpyObj: jasmine.SpyObj<RendererFactory2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let canvasSpyObj: jasmine.SpyObj<HTMLCanvasElement>;
    let canvasContextSpyObj: jasmine.SpyObj<CanvasRenderingContext2D>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let svgUtilityServiceSpyObj: jasmine.SpyObj<SvgUtilityService>;
    let service: ToolFillService;

    const drawingDimensions: Vec2 = { x: 100, y: 100 };
    const rgbaComponents = [32, 64, 128, 128];
    const expectedColor = 'rgba(255, 255, 255, 1)';

    beforeEach(() => {
        rendererSpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild']);
        rendererFactorySpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactorySpyObj.createRenderer.and.returnValue(rendererSpyObj);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement'], {
            drawingRoot: {} as SVGSVGElement,
            dimensions: drawingDimensions,
        });

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(expectedColor);
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: colorSpyObj,
        });

        canvasContextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        canvasContextSpyObj.getImageData.and.returnValue(({
            data: [0, 0, 0, 0, ...rgbaComponents, 0, 0, 0, 0, 0, 0, 0, 0],
        } as unknown) as ImageData);

        canvasSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['getContext'], {
            width: drawingDimensions.x,
            height: drawingDimensions.y,
        });
        canvasSpyObj.getContext.and.returnValue(canvasContextSpyObj);

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);
        svgUtilityServiceSpyObj = jasmine.createSpyObj('SvgUtilitySpyObj', ['getCanvasFromSvgRoot']);
        svgUtilityServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));

        TestBed.configureTestingModule({
            providers: [
                { provide: Renderer2, useValue: rendererSpyObj },
                { provide: RendererFactory2, useValue: rendererFactorySpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
                { provide: SvgUtilityService, useValue: svgUtilityServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolFillService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should return early if the mouse button pressed was not the left', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        Tool.isMouseInsideDrawing = true;
        service.onMouseDown(event);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#onMouseDown should return early if the mouse was not pressed inside the drawing', () => {
        const event = { button: MouseButton.Left } as MouseEvent;
        Tool.isMouseInsideDrawing = false;
        service.onMouseDown(event);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#onMouseDown should apply the color in the determined area', () => {
        const applyColorSpy = spyOn<any>(service, 'applyColor');
        const event = { button: MouseButton.Left } as MouseEvent;
        Tool.isMouseInsideDrawing = true;
        service['group'] = {} as SVGGElement;

        service.onMouseDown(event);

        expect(rendererSpyObj.createElement).toHaveBeenCalledWith('g', 'svg');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(service['group'], 'fill', expectedColor);
        expect(applyColorSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(service['group']);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(new AppendElementCommand(drawingServiceSpyObj, service['group']));
    });

    it('#applyColor should initialize the canvas, set the selectedColor and start the Breadth-First search', fakeAsync(() => {
        const mousePosition: Vec2 = { x: 3, y: 3 };
        Tool.mousePosition = mousePosition;
        const initializeCanvasSpy = spyOn<any>(service, 'initializeCanvas');
        const getPixelColorSpy = spyOn<any>(service, 'getPixelColor');
        const breadthFirstSearchSpy = spyOn<any>(service, 'breadthFirstSearch');
        service['applyColor']();
        tick();
        expect(initializeCanvasSpy).toHaveBeenCalled();
        expect(service['pointsQueue'].size()).toEqual(1);
        expect(getPixelColorSpy).toHaveBeenCalledWith(mousePosition);
        expect(breadthFirstSearchSpy).toHaveBeenCalled();
    }));

    it('#initializeCanvas should initialize the canvas, the context and the data', fakeAsync(() => {
        service['initializeCanvas']();
        tick();
        expect(svgUtilityServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingServiceSpyObj.drawingRoot);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalledWith(0, 0, drawingDimensions.x, drawingDimensions.y);
    }));
});
