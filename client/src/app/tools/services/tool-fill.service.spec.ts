import { Renderer2, RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolFillService } from '@app/tools/services/tool-fill.service';

// tslint:disable: max-line-length
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ToolFillService', () => {
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
        const mousePosition: Vec2 = { x: 0, y: 0 };
        Tool.mousePosition = mousePosition;
        const canvasMock = { width: 1 } as HTMLCanvasElement;
        service['canvas'] = canvasMock;
        const dataMock = ([12] as unknown) as Uint8ClampedArray;
        service['data'] = dataMock;
        const initializeCanvasSpy = spyOn<any>(service, 'initializeCanvas');
        const getPixelColorSpy = spyOn<any>(service, 'getPixelColor').and.callThrough();
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
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingServiceSpyObj.drawingRoot);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalledWith(0, 0, drawingDimensions.x, drawingDimensions.y);
    }));

    it('#breadthFirstSearch should dequeue points and add a rectangle to four neighbour pixels', () => {
        const expectedPoint = { x: 10, y: 10 } as Vec2;
        const pointsQueueSpyObj = jasmine.createSpyObj('Queue<Vec2>', ['isEmpty', 'dequeue']);
        let firstIteration = true;
        pointsQueueSpyObj.isEmpty.and.callFake(() => {
            if (firstIteration) {
                firstIteration = false;
                return false;
            } else {
                return true;
            }
        });
        pointsQueueSpyObj.dequeue.and.returnValue(expectedPoint);
        service['pointsQueue'] = pointsQueueSpyObj;
        const addRectangleOnPointSpy = spyOn<any>(service, 'addRectangleOnPoint');

        service['breadthFirstSearch']();

        expect(pointsQueueSpyObj.dequeue).toHaveBeenCalled();
        expect(addRectangleOnPointSpy).toHaveBeenCalledWith({ x: expectedPoint.x + 1, y: expectedPoint.y } as Vec2);
        expect(addRectangleOnPointSpy).toHaveBeenCalledWith({ x: expectedPoint.x - 1, y: expectedPoint.y } as Vec2);
        expect(addRectangleOnPointSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y + 1 } as Vec2);
        expect(addRectangleOnPointSpy).toHaveBeenCalledWith({ x: expectedPoint.x, y: expectedPoint.y - 1 } as Vec2);
    });

    it('#breadthFirstSearch should stop when the queue is empty', () => {
        const pointsQueueSpyObj = jasmine.createSpyObj('Queue<Vec2>', ['isEmpty']);
        pointsQueueSpyObj.isEmpty.and.returnValue(true);
        service['pointsQueue'] = pointsQueueSpyObj;
        service['breadthFirstSearch']();
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#addRectangleOnPoint should return early if the point is invalid', () => {
        spyOn<any>(service, 'verifyPoint').and.returnValue(false);
        const point = { x: 1, y: 1 } as Vec2;
        service['addRectangleOnPoint'](point);
        expect(rendererSpyObj.createElement).not.toHaveBeenCalled();
    });

    it('#addRectangleOnPoint should create a rectangle on the point and enqueue the point if the point is valid', () => {
        spyOn<any>(service, 'verifyPoint').and.returnValue(true);
        const pointsQueueSpyObj = jasmine.createSpyObj('Queue<Vec2>', ['enqueue']);
        service['pointsQueue'] = pointsQueueSpyObj;
        const svgPathElementStub = {} as SVGPathElement;
        rendererSpyObj.createElement.and.returnValue(svgPathElementStub);
        const point = { x: 1, y: 1 } as Vec2;
        service['addRectangleOnPoint'](point);
        expect(rendererSpyObj.createElement).toHaveBeenCalledWith('rect', 'svg');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgPathElementStub, 'x', `${point.x}`);
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgPathElementStub, 'y', `${point.y}`);
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgPathElementStub, 'width', '1');
        expect(rendererSpyObj.setAttribute).toHaveBeenCalledWith(svgPathElementStub, 'height', '1');
        expect(rendererSpyObj.appendChild).toHaveBeenCalledWith(service['group'], svgPathElementStub);

        expect(pointsQueueSpyObj.enqueue).toHaveBeenCalledWith(point);
    });

    it('#verifyPoint should return false if the point is not in the drawing', () => {
        const point = { x: -1, y: -1 } as Vec2;
        const returnValue = service['verifyPoint'](point);
        expect(returnValue).toEqual(false);
    });

    it('#verifyPoint should return false if the point has already been visited', () => {
        const visitedPointsSpyObj = jasmine.createSpyObj('Set<string>', ['has']);
        visitedPointsSpyObj.has.and.returnValue(true);
        service['visitedPoints'] = visitedPointsSpyObj;
        const returnValue = service['verifyPoint']({ x: 1, y: 1 } as Vec2);
        expect(returnValue).toEqual(false);
    });

    it("#verifyPoint should add the point to visitedPoints and return false if the point's color does not match the selected color", () => {
        const point = { x: 1, y: 1 } as Vec2;
        spyOn<any>(service, 'getPixelColor');
        const visitedPointsSpyObj = jasmine.createSpyObj('Set<string>', ['has', 'add']);
        visitedPointsSpyObj.has.and.returnValue(false);
        service['visitedPoints'] = visitedPointsSpyObj;
        spyOn<any>(service, 'matchesSelectedColor').and.returnValue(false);
        const returnValue = service['verifyPoint'](point);
        expect(visitedPointsSpyObj.add).toHaveBeenCalledWith(`${point.x}, ${point.y}`);
        expect(returnValue).toEqual(false);
    });

    it('#verifyPoint should add the point to visitedPoints and return true if the point is inside the drawing, match the selected color and has not been visited', () => {
        const point = { x: 1, y: 1 } as Vec2;
        const visitedPointsSpyObj = jasmine.createSpyObj('Set<string>', ['has', 'add']);
        visitedPointsSpyObj.has.and.returnValue(false);
        service['visitedPoints'] = visitedPointsSpyObj;
        spyOn<any>(service, 'matchesSelectedColor').and.returnValue(true);
        spyOn<any>(service, 'getPixelColor');
        const returnValue = service['verifyPoint'](point);
        expect(visitedPointsSpyObj.add).toHaveBeenCalledWith(`${point.x}, ${point.y}`);
        expect(returnValue).toEqual(true);
    });

    it('#matchesSelectedColor should return true if the compared color is within the set deviation', () => {
        const selectedColor = { red: 0, green: 0, blue: 0, alpha: 1 } as Color;
        service['selectedColor'] = selectedColor;
        service['settings'].fillDeviation = 0;
        const returnValue = service['matchesSelectedColor'](selectedColor);

        expect(returnValue).toEqual(true);
    });

    it('#matchesSelectedColor should return false if the compared color is not within the set deviation', () => {
        const selectedColor = { red: 0, green: 0, blue: 0, alpha: 1 } as Color;
        const comparedColor = { red: 255, green: 255, blue: 255, alpha: 1 } as Color;
        service['selectedColor'] = selectedColor;
        service['settings'].fillDeviation = 0;
        const returnValue = service['matchesSelectedColor'](comparedColor);

        expect(returnValue).toEqual(false);
    });
});
