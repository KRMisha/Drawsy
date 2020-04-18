import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddElementCommand } from '@app/drawing/classes/commands/add-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Queue } from '@app/shared/classes/queue';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolFillService } from '@app/tools/services/tool-fill.service';

// tslint:disable: max-line-length
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count

describe('ToolFillService', () => {
    let rendererSpyObj: jasmine.SpyObj<Renderer2>;
    let rendererFactorySpyObj: jasmine.SpyObj<RendererFactory2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let canvasSpyObj: jasmine.SpyObj<HTMLCanvasElement>;
    let canvasContextSpyObj: jasmine.SpyObj<CanvasRenderingContext2D>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let rasterizationServiceSpyObj: jasmine.SpyObj<RasterizationService>;
    let snackBarSpyObj: jasmine.SpyObj<MatSnackBar>;
    let service: ToolFillService;

    let fillPixelsToVisitSpyObj: jasmine.SpyObj<Queue<Vec2>>;

    const drawingDimensions: Vec2 = { x: 100, y: 100 };
    const rgbaComponents = [32, 64, 128, 128];
    const expectedColor = 'rgba(255, 255, 255, 1)';
    const initialCanvasDimensions: Vec2 = { x: 10, y: 10 };

    beforeEach(() => {
        rendererSpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild']);
        rendererFactorySpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactorySpyObj.createRenderer.and.returnValue(rendererSpyObj);
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['cloneNode']);
        drawingRootSpyObj.cloneNode.and.returnValue(drawingRootSpyObj);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'hideUiElements', 'showUiElements'], {
            drawingRoot: drawingRootSpyObj,
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
        rasterizationServiceSpyObj = jasmine.createSpyObj('SvgUtilitySpyObj', ['getCanvasFromSvgRoot', 'getPixelColor']);
        rasterizationServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));
        rasterizationServiceSpyObj.getPixelColor.and.returnValue(colorSpyObj);

        snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

        fillPixelsToVisitSpyObj = jasmine.createSpyObj('Queue<Vec2>', ['isEmpty', 'enqueue', 'dequeue']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Renderer2, useValue: rendererSpyObj },
                { provide: RendererFactory2, useValue: rendererFactorySpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
                { provide: RasterizationService, useValue: rasterizationServiceSpyObj },
                { provide: MatSnackBar, useValue: snackBarSpyObj },
            ],
        });
        service = TestBed.inject(ToolFillService);

        service['fillPixelsToVisit'] = fillPixelsToVisitSpyObj;
        service['canvasDimensions'] = initialCanvasDimensions;
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

    it('#onMouseDown should fill the determined area with the selected color and open a snackBar', () => {
        const fillWithColorSpy = spyOn<any>(service, 'fillWithColor');
        const event = { button: MouseButton.Left } as MouseEvent;
        Tool.isMouseInsideDrawing = true;
        service['group'] = {} as SVGGElement;

        service.onMouseDown(event);

        expect(snackBarSpyObj.open).toHaveBeenCalledWith('Le remplissage est en cours', undefined, { duration: 500 });
        expect(fillWithColorSpy).toHaveBeenCalled();
    });

    it('#onPrimaryColorChange should not change the fill color if the group is undefined', () => {
        service['group'] = undefined;
        service.onPrimaryColorChange(colorSpyObj);

        expect(rendererSpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onPrimaryColorChange should change the fill color if the group is defined', () => {
        const expectedGroup = {} as SVGGElement;
        service['group'] = expectedGroup;
        service.onPrimaryColorChange(colorSpyObj);

        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(expectedGroup, 'fill', expectedColor);
    });

    it('#fillWithColor should initialize the canvas and set the selectedColor', fakeAsync(() => {
        Tool.mousePosition.x = 0;
        Tool.mousePosition.y = 0;
        const mousePosition: Vec2 = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        const initializeCanvasSpy = spyOn<any>(service, 'initializeCanvas');
        const expectedCanvasData = ([12] as unknown) as Uint8ClampedArray;
        service['canvasData'] = expectedCanvasData;
        service['fillWithColor']();
        tick();
        expect(initializeCanvasSpy).toHaveBeenCalled();
        expect(rasterizationServiceSpyObj.getPixelColor).toHaveBeenCalledWith(expectedCanvasData, initialCanvasDimensions.x, mousePosition);
    }));

    it('#fillWithColor should start the Breadth-First search and get rectangles from bitmap ', fakeAsync(() => {
        Tool.mousePosition.x = 0;
        Tool.mousePosition.y = 0;
        const mousePosition: Vec2 = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        const expectedBitMap: boolean[][] = [[true]];
        const expectedRectangles: Rect[] = [{} as Rect];
        const breadthFirstSearchSpy = spyOn<any>(service, 'breadthFirstSearch');
        breadthFirstSearchSpy.and.returnValue(expectedBitMap);
        const getRectanglesFromBitmapSpy = spyOn<any>(service, 'getRectanglesFromBitmap').and.returnValue(expectedRectangles);
        const addRectanglesSpy = spyOn<any>(service, 'addRectangles');
        service['fillWithColor']();
        tick();

        expect(breadthFirstSearchSpy).toHaveBeenCalledWith(mousePosition);
        expect(getRectanglesFromBitmapSpy).toHaveBeenCalledWith(expectedBitMap);
        expect(addRectanglesSpy).toHaveBeenCalledWith(expectedRectangles);
    }));

    it('#fillWithColor should add the group to the drawing and add a command to history service', fakeAsync(() => {
        const expectedGroup = {} as SVGGElement;
        rendererSpyObj.createElement.and.returnValue(expectedGroup);
        service['fillWithColor']();
        tick();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(expectedGroup);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(new AddElementCommand(drawingServiceSpyObj, expectedGroup));
        expect(service['group']).toBeUndefined();
    }));

    it('#initializeCanvas should initialize the canvasData and the canvasDimensions from the canvas and the context', fakeAsync(() => {
        service['initializeCanvas']();
        tick();
        expect(drawingServiceSpyObj.hideUiElements).toHaveBeenCalled();
        expect(drawingRootSpyObj.cloneNode).toHaveBeenCalledWith(true);
        expect(drawingServiceSpyObj.showUiElements).toHaveBeenCalled();
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingRootSpyObj);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalled();
        expect(service['canvasData']).toEqual([0, 0, 0, 0, ...rgbaComponents, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(service['canvasDimensions'].x).toEqual(canvasSpyObj.width);
        expect(service['canvasDimensions'].y).toEqual(canvasSpyObj.height);
    }));

    it('#breadthFirstSearch should enqueue the startPixel, dequeue a pixel, and call enqueuePixelIfValid with four neighbor pixels', () => {
        const expectedPoint = { x: 1, y: 1 } as Vec2;
        const enqueuePixelIfValidSpy = spyOn<any>(service, 'enqueuePixelIfValid');
        let firstIteration = true;
        fillPixelsToVisitSpyObj.isEmpty.and.callFake(() => {
            if (firstIteration) {
                firstIteration = false;
                return false;
            } else {
                return true;
            }
        });
        fillPixelsToVisitSpyObj.dequeue.and.returnValue(expectedPoint);

        service['breadthFirstSearch'](expectedPoint);

        expect(fillPixelsToVisitSpyObj.enqueue).toHaveBeenCalledWith(expectedPoint);
        expect(fillPixelsToVisitSpyObj.dequeue).toHaveBeenCalled();
        expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x + 1, y: expectedPoint.y } as Vec2);
        expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x - 1, y: expectedPoint.y } as Vec2);
        expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y + 1 } as Vec2);
        expect(enqueuePixelIfValidSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y - 1 } as Vec2);
    });

    it('#breadthFirstSearch should stop when the queue is empty', () => {
        fillPixelsToVisitSpyObj.isEmpty.and.returnValue(true);
        service['breadthFirstSearch']({ x: 10, y: 10 } as Vec2);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#enqueuePixelIfValid should not call fillPixelsToVisit.enqueue if the point is not in the drawing', () => {
        const visitedFillPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedFillPixelsSpyObj.has.and.returnValue(false);
        service['visitedFillPixels'] = visitedFillPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: -1, y: -1 } as Vec2);

        expect(fillPixelsToVisitSpyObj.enqueue).not.toHaveBeenCalled();
        expect(visitedFillPixelsSpyObj.add).not.toHaveBeenCalled();
    });

    it('#enqueuePixelIfValid should not call fillPixelsToVisit.enqueue if the point has already been visited', () => {
        const visitedFillPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedFillPixelsSpyObj.has.and.returnValue(true);
        service['visitedFillPixels'] = visitedFillPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

        expect(fillPixelsToVisitSpyObj.enqueue).not.toHaveBeenCalled();
        expect(visitedFillPixelsSpyObj.add).not.toHaveBeenCalled();
    });

    it('#enqueuePixelIfValid should not call fillPixelsToVisit.enqueue if the color of the pixel is not the selected color', () => {
        const visitedFillPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedFillPixelsSpyObj.has.and.returnValue(false);
        service['visitedFillPixels'] = visitedFillPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(false);
        service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

        expect(fillPixelsToVisitSpyObj.enqueue).not.toHaveBeenCalled();
        expect(visitedFillPixelsSpyObj.add).not.toHaveBeenCalled();
    });

    it('#enqueuePixelIfValid should call fillPixelsToVisit.enqueue if the pixel is valid and should add the pixel to visitedFillPixels', () => {
        const visitedFillPixelsSpyObj = jasmine.createSpyObj('Set<string>', ['add', 'has']);
        visitedFillPixelsSpyObj.has.and.returnValue(false);
        service['visitedFillPixels'] = visitedFillPixelsSpyObj;
        spyOn<any>(service, 'isSelectedColor').and.returnValue(true);
        service['enqueuePixelIfValid']({ x: 1, y: 1 } as Vec2);

        expect(fillPixelsToVisitSpyObj.enqueue).toHaveBeenCalled();
        expect(visitedFillPixelsSpyObj.add).toHaveBeenCalled();
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

    it('#addRectangles should create the SVGGElement and append the rectangles', () => {
        const rendererElementStub = {} as SVGGElement;
        rendererSpyObj.createElement.and.returnValue(rendererElementStub);
        const rects = [
            { x: 69, y: 420, width: 666, height: 911 },
            { x: 1, y: 5, width: 9, height: 13 },
            { x: 2, y: 6, width: 10, height: 14 },
            { x: 3, y: 7, width: 11, height: 15 },
            { x: 4, y: 8, width: 12, height: 16 },
        ];
        service['addRectangles'](rects);

        const padding = 0.5;
        for (const rect of rects) {
            expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(rendererElementStub, 'x', `${rect.x - padding}`);
            expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(rendererElementStub, 'y', `${rect.y - padding}`);
            expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(rendererElementStub, 'width', `${rect.width + 2 * padding}`);
            expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(rendererElementStub, 'height', `${rect.height + 2 * padding}`);
        }
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(rendererElementStub);
    });

    it('#getRectanglesFromBitmap should generate correct rectangles from bitmap', () => {
        const input: boolean[][] = [
            [false, false, false, false, false, false, true, false, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [false, false, false, false, false, false, true, false, true],
            [true, false, true, true, true, false, true, false, true],
            [true, false, false, false, false, false, true, false, true],
            [true, false, false, false, false, false, true, false, true],
            [false, false, false, false, false, false, true, false, true],
        ];
        const actualOutput = service['getRectanglesFromBitmap'](input);
        const expectedOutput = [
            { x: 6, y: 0, width: 1, height: 1 } as Rect,
            { x: 0, y: 1, width: 9, height: 1 } as Rect,
            { x: 0, y: 2, width: 9, height: 1 } as Rect,
            { x: 6, y: 3, width: 1, height: 1 } as Rect,
            { x: 0, y: 4, width: 1, height: 1 } as Rect,
            { x: 2, y: 4, width: 3, height: 1 } as Rect,
            { x: 6, y: 4, width: 1, height: 1 } as Rect,
            { x: 0, y: 5, width: 1, height: 1 } as Rect,
            { x: 6, y: 5, width: 1, height: 1 } as Rect,
            { x: 0, y: 6, width: 1, height: 1 } as Rect,
            { x: 6, y: 6, width: 1, height: 1 } as Rect,
            { x: 6, y: 7, width: 1, height: 1 } as Rect,
        ];
        expect(actualOutput).toEqual(expectedOutput);
    });
});
