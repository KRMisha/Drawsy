import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Queue } from '@app/shared/classes/queue';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolFillService } from '@app/tools/services/tool-fill.service';

// tslint:disable: max-line-length
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
    let rasterizationServiceSpyObj: jasmine.SpyObj<RasterizationService>;
    let service: ToolFillService;

    let pixelQueueSpyObj: jasmine.SpyObj<Queue<Vec2>>;

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
        rasterizationServiceSpyObj = jasmine.createSpyObj('SvgUtilitySpyObj', ['getCanvasFromSvgRoot']);
        rasterizationServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));

        pixelQueueSpyObj = jasmine.createSpyObj('Queue<Vec2>', ['isEmpty', 'enqueue', 'dequeue']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Renderer2, useValue: rendererSpyObj },
                { provide: RendererFactory2, useValue: rendererFactorySpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
                { provide: RasterizationService, useValue: rasterizationServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolFillService);
        service['pixelQueue'] = pixelQueueSpyObj;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should not do anything if the mouse button pressed was not the left', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        Tool.isMouseInsideDrawing = true;
        service.onMouseDown(event);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#onMouseDown should not do anything if the mouse was not pressed inside the drawing', () => {
        const event = { button: MouseButton.Left } as MouseEvent;
        Tool.isMouseInsideDrawing = false;
        service.onMouseDown(event);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#onMouseDown should fill the determined area with the selected color', () => {
        const fillWithColorSpy = spyOn<any>(service, 'fillWithColor');
        const event = { button: MouseButton.Left } as MouseEvent;
        Tool.isMouseInsideDrawing = true;
        service['group'] = {} as SVGGElement;

        service.onMouseDown(event);

        expect(rendererSpyObj.createElement).toHaveBeenCalledWith('g', 'svg');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(service['group'], 'fill', expectedColor);
        expect(fillWithColorSpy).toHaveBeenCalled();
    });

    it('#fillWithColor should initialize the canvas and set the selectedColor', fakeAsync(() => {
        Tool.mousePosition.x = 0;
        Tool.mousePosition.y = 0;
        const mousePosition: Vec2 = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        const initializeCanvasSpy = spyOn<any>(service, 'initializeCanvas');
        const dataMock = ([12] as unknown) as Uint8ClampedArray;
        service['data'] = dataMock;
        const getPixelColorSpy = spyOn<any>(service, 'getPixelColor').and.callThrough();
        service['fillWithColor']();
        tick();
        expect(initializeCanvasSpy).toHaveBeenCalled();
        expect(getPixelColorSpy).toHaveBeenCalledWith(mousePosition);
    }));

    it('#fillWithColor should start the Breadth-First search, ', fakeAsync(() => {
        Tool.mousePosition.x = 0;
        Tool.mousePosition.y = 0;
        const mousePosition: Vec2 = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        const breadthFirstSearchSpy = spyOn<any>(service, 'breadthFirstSearch');
        service['fillWithColor']();
        tick();

        expect(breadthFirstSearchSpy).toHaveBeenCalledWith(mousePosition);
    }));

    it('#fillWithColor should start the Breadth-First search, ', fakeAsync(() => {
        Tool.mousePosition.x = 0;
        Tool.mousePosition.y = 0;
        const mousePosition: Vec2 = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        const breadthFirstSearchSpy = spyOn<any>(service, 'breadthFirstSearch');
        service['fillWithColor']();
        tick();

        expect(breadthFirstSearchSpy).toHaveBeenCalledWith(mousePosition);
    }));

    it('#fillWithColor should add the group to the drawing and add a command to history service', fakeAsync(() => {
        const expectedGroup = {} as SVGGElement;
        service['group'] = expectedGroup;
        service['fillWithColor']();
        tick();
        // tslint:disable: no-non-null-assertion
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(expectedGroup);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(new AppendElementCommand(drawingServiceSpyObj, expectedGroup));
        // tslint:enable: no-non-null-assertion
    }));

    it('#initializeCanvas should initialize the data and the canvasWidth from the canvas and the context', fakeAsync(() => {
        service['initializeCanvas']();
        tick();
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingServiceSpyObj.drawingRoot);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalled();
        expect(service['data']).toEqual([0, 0, 0, 0, ...rgbaComponents, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(service['canvasWidth']).toEqual(canvasSpyObj.width);
    }));

    it(
        '#breadthFirstSearch should enqueue the startPixel, dequeue a pixel, call addRectangleOnPixel and call enqueuePixelIfValid ' +
            'with four neighbour pixels',
        () => {
            const expectedPoint = { x: 10, y: 10 } as Vec2;
            const enqueuePixelIfValidSpy = spyOn<any>(service, 'enqueuePixelIfValid');
            let firstIteration = true;
            pixelQueueSpyObj.isEmpty.and.callFake(() => {
                if (firstIteration) {
                    firstIteration = false;
                    return false;
                } else {
                    return true;
                }
            });
            pixelQueueSpyObj.dequeue.and.returnValue(expectedPoint);
            const addRectangleOnPixelSpy = spyOn<any>(service, 'addRectangleOnPixel');

            service['breadthFirstSearch'](expectedPoint);

            expect(pixelQueueSpyObj.enqueue).toHaveBeenCalledWith(expectedPoint);
            expect(pixelQueueSpyObj.dequeue).toHaveBeenCalled();
            expect(addRectangleOnPixelSpy).toHaveBeenCalledWith(expectedPoint);
            expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x + 1, y: expectedPoint.y } as Vec2);
            expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x - 1, y: expectedPoint.y } as Vec2);
            expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y + 1 } as Vec2);
            expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y - 1 } as Vec2);
        }
    );

    it('#breadthFirstSearch should stop when the queue is empty', () => {
        pixelQueueSpyObj.isEmpty.and.returnValue(true);
        service['breadthFirstSearch']({ x: 10, y: 10 } as Vec2);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#addRectangleOnPixel should create a rectangle on the pixel', () => {
        const svgRectStub = {} as SVGRect;
        rendererSpyObj.createElement.and.returnValue(svgRectStub);
        const point = { x: 1, y: 1 } as Vec2;
        service['addRectangleOnPixel'](point);

        expect(rendererSpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'x', `${point.x}`);
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'y', `${point.y}`);
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'width', '1');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgRectStub, 'height', '1');
        expect(rendererSpyObj.appendChild).toHaveBeenCalledWith(service['group'], svgRectStub);
    });

    it('#enqueuePixelIfValid should not call pixelQueue.enqueue if the point is not in the drawing and should add the pixel to visitedPixels', () => {
        const visitedPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedPixelsSpyObj.has.and.returnValue(false);
        service['visitedPixels'] = visitedPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: -1, y: -1 } as Vec2);

        expect(pixelQueueSpyObj.enqueue).not.toHaveBeenCalled();
        expect(visitedPixelsSpyObj.add).toHaveBeenCalled();
    });

    it('#enqueuePixelIfValid should not call pixelQueue.enqueue if the point has already been visited and should add the pixel to visitedPixels', () => {
        const visitedPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedPixelsSpyObj.has.and.returnValue(true);
        service['visitedPixels'] = visitedPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

        expect(pixelQueueSpyObj.enqueue).not.toHaveBeenCalled();
        expect(visitedPixelsSpyObj.add).toHaveBeenCalled();
    });

    it(
        '#enqueuePixelIfValid should not call pixelQueue.enqueue if the color of the pixel is not the selected color and should add ' +
            'the pixel to visitedPixels',
        () => {
            const visitedPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
            visitedPixelsSpyObj.has.and.returnValue(false);
            service['visitedPixels'] = visitedPixelsSpyObj;
            spyOn<any>(service, 'getPixelColor').and.returnValue(colorSpyObj);
            spyOn<any>(service, 'isSelectedColor').and.returnValue(false);
            service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

            expect(pixelQueueSpyObj.enqueue).not.toHaveBeenCalled();
            expect(visitedPixelsSpyObj.add).toHaveBeenCalled();
        }
    );

    it('#enqueuePixelIfValid should call pixelQueue.enqueue if the pixel is valid and should add the pixel to visitedPixels', () => {
        const visitedPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedPixelsSpyObj.has.and.returnValue(false);
        service['visitedPixels'] = visitedPixelsSpyObj;
        spyOn<any>(service, 'getPixelColor').and.returnValue(colorSpyObj);
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

        expect(pixelQueueSpyObj.enqueue).toHaveBeenCalled();
        expect(visitedPixelsSpyObj.add).toHaveBeenCalled();
    });

    it('#isSelectedColor should return true if the compared color is within the set deviation', () => {
        const selectedColor = { red: 0, green: 0, blue: 0, alpha: 1 } as Color;
        service['selectedColor'] = selectedColor;
        service['settings'].fillDeviation = 0;
        const returnValue = service['isSelectedColor'](selectedColor);

        expect(returnValue).toEqual(true);
    });

    it('#isSelectedColor should return false if the compared color is not within the set deviation', () => {
        const selectedColor = { red: 0, green: 0, blue: 0, alpha: 1 } as Color;
        const comparedColor = { red: 255, green: 255, blue: 255, alpha: 1 } as Color;
        service['selectedColor'] = selectedColor;
        service['settings'].fillDeviation = 0;
        const returnValue = service['isSelectedColor'](comparedColor);

        expect(returnValue).toEqual(false);
    });
});
