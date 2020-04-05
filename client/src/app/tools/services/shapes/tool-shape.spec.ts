import { Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolData } from '@app/tools/classes/tool-data';
import ToolInfo from '@app/tools/constants/tool-info';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';
import { Tool } from '@app/tools/services/tool';

// tslint:disable: no-any
// tslint:disable: no-string-literal

class ToolShapeMock extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        toolInfo: ToolData,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, historyService, toolInfo, isShapeAlwaysRegular);
    }
    getShapeString(): string {
        return '';
    }
    updateShape(shapeArea: Rect, scale: Vec2, shape: SVGGraphicsElement): void {
        return;
    }
}

describe('ToolShape', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let toolShape: ToolShapeMock;
    let updateShapeAreaSpy: jasmine.Spy;

    const rgbaStringValue = 'rgba(0, 0, 0, 1)';

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement']);

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(rgbaStringValue);
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: colorSpyObj,
            secondaryColor: colorSpyObj,
        });
        toolShape = new ToolShapeMock(
            rendererFactory2SpyObj,
            drawingServiceSpyObj,
            colorServiceSpyObj,
            historyServiceSpyObj,
            ToolInfo.Pencil,
            false
        );
        updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
    });

    it('should create an instance', () => {
        expect(toolShape).toBeTruthy();
    });

    it('#onMouseMove should call #updateShapeArea', () => {
        toolShape.onMouseMove();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it("#onMouseDown should call #updateShapeArea and drawingService's addElement on left click inside drawing surface", () => {
        Tool.isMouseInsideDrawing = true;
        const createShapeSpy = spyOn<any>(toolShape, 'createShape').and.callThrough();
        toolShape.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
        expect(createShapeSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it("#onMouseDown should not call #updateShapeArea and drawingService's addElement on right click", () => {
        Tool.isMouseInsideDrawing = true;
        const createShapeSpy = spyOn<any>(toolShape, 'createShape').and.callThrough();
        toolShape.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
        expect(createShapeSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it("#onMouseDown should not call #updateShapeArea and drawingService's addElement if mouse is not inside the drawing surface", () => {
        Tool.isMouseInsideDrawing = false;
        const createShapeSpy = spyOn<any>(toolShape, 'createShape').and.callThrough();
        toolShape.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
        expect(createShapeSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call #stopDrawing on left click', () => {
        const stopDrawingSpy = spyOn<any>(toolShape, 'stopDrawing').and.callThrough();
        toolShape.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#onMouseUp should not call #stopDrawing on right click', () => {
        const stopDrawingSpy = spyOn<any>(toolShape, 'stopDrawing').and.callThrough();
        toolShape.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(stopDrawingSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should call #updateShapeArea and set isShiftDown to true on shift click', () => {
        toolShape['isShiftDown'] = false;
        toolShape.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(true);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should not call #updateShapeArea and set isShiftDown to true if shift is not pressed', () => {
        toolShape['isShiftDown'] = false;
        toolShape.onKeyDown({ key: 'notShift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(false);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
    });

    it('#onKeyUp should call #updateShapeArea and set isShiftDown to false if shift is pressed', () => {
        toolShape['isShiftDown'] = true;
        toolShape.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(false);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should not call #updateShapeArea and set isShiftDown to true if shift not is pressed', () => {
        toolShape['isShiftDown'] = true;
        toolShape.onKeyUp({ key: 'notShift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(true);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
    });

    it("#onPrimaryColorChange should set the shape's fill color with the parameter's color if the shape is not undefined", () => {
        const shape = {} as SVGGraphicsElement;
        toolShape['shape'] = shape;
        toolShape.onPrimaryColorChange(colorSpyObj);
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'fill', rgbaStringValue);
    });

    it('#onPrimaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        toolShape['shape'] = undefined;
        toolShape.onPrimaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it("#onSecondaryColorChange should set the shape's stroke color with the parameter's color if the shape is not undefined", () => {
        const shape = {} as SVGGraphicsElement;
        toolShape['shape'] = shape;
        toolShape.onSecondaryColorChange(colorSpyObj);
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'stroke', rgbaStringValue);
    });

    it('#onSecondaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        toolShape['shape'] = undefined;
        toolShape.onSecondaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#createShape should not fill the shape if it is BorderOnly', () => {
        const shapeMock = {} as SVGGraphicsElement;
        renderer2SpyObj.createElement.and.returnValue(shapeMock);
        toolShape.settings.shapeType = ShapeType.BorderOnly;
        toolShape['createShape']();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shapeMock, 'fill', 'none');
    });

    it("#createShape should set the shape's stroke-width and data-padding if the shapeType is fillOnly", () => {
        const shapeMock = {} as SVGGraphicsElement;
        renderer2SpyObj.createElement.and.returnValue(shapeMock);
        toolShape.settings.shapeType = ShapeType.FillOnly;
        const shapeBorderWidth = 10;
        toolShape.settings.shapeBorderWidth = shapeBorderWidth;
        toolShape['createShape']();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shapeMock, 'stroke-width', shapeBorderWidth.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shapeMock, 'data-padding', `${shapeBorderWidth / 2}`);
    });

    it('#updateShapeArea should not call updateShape if isLeftMouseButtonDown is false and the shape', () => {
        const shapeMock = {} as SVGGraphicsElement;
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = false;
        const updateShapeSpy = spyOn(toolShape, 'updateShape');
        toolShape['updateShapeArea']();
        expect(updateShapeSpy).not.toHaveBeenCalled();
    });

    it('#updateShapeArea should call updateShapeArea if isLeftMouseButtonDown is true and the shape', () => {
        const shapeMock = {} as SVGGraphicsElement;
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = true;
        toolShape['updateShapeArea']();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#updateShapeArea should make shape regular when shape is always regular', () => {
        const shapeMock = {} as SVGGraphicsElement;
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = true;
        toolShape['isShapeAlwaysRegular'] = true;
        toolShape['updateShapeArea']();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#updateShapeArea should make shape regular when shift key is pressed', () => {
        const shapeMock = {} as SVGGraphicsElement;
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = true;
        toolShape['isShiftDown'] = true;
        toolShape['updateShapeArea']();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#updateShapeArea should use negative sideSize when the mouse is at the bottom-right of the origin calculation', () => {
        const shapeMock = {} as SVGGraphicsElement;
        Tool.mousePosition = { x: -1, y: -1 };
        toolShape['shapeOrigin'] = { x: 0, y: 0 };
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = true;
        toolShape['isShiftDown'] = true;
        toolShape['updateShapeArea']();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#updateShapeArea should use positive sideSize when the mouse is at the top-left of the origin calculation', () => {
        const shapeMock = {} as SVGGraphicsElement;
        Tool.mousePosition = { x: 1, y: 1 };
        toolShape['shapeOrigin'] = { x: 0, y: 0 };
        toolShape['shape'] = shapeMock;
        Tool.isLeftMouseButtonDown = true;
        toolShape['isShiftDown'] = true;
        toolShape['updateShapeArea']();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#stopDrawing should set shape to undefined if it was not before the call', () => {
        const shapeMock = {} as SVGGraphicsElement;
        Tool.mousePosition = { x: -1, y: -1 };
        toolShape['shapeOrigin'] = { x: 0, y: 0 };
        toolShape['shape'] = shapeMock;
        toolShape['stopDrawing']();
        expect(toolShape['shape']).not.toBeTruthy();
    });

    it('#stopDrawing should not remove the element if it is not a valid regular or non-regular shape', () => {
        const shapeMock = {} as SVGGraphicsElement;
        Tool.mousePosition = { x: 0, y: 0 };
        toolShape['shapeOrigin'] = { x: 0, y: 0 };
        toolShape['shape'] = shapeMock;
        toolShape['isShapeAlwaysRegular'] = false;
        toolShape['isShiftDown'] = false;
        toolShape['stopDrawing']();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });

    it('#stopDrawing should not remove the element if it is not a valid regular or non-regular shape', () => {
        const shapeMock = {} as SVGGraphicsElement;
        Tool.mousePosition = { x: 0, y: 0 };
        toolShape['shapeOrigin'] = { x: 0, y: 0 };
        toolShape['shape'] = shapeMock;
        toolShape['isShapeAlwaysRegular'] = true;
        toolShape['isShiftDown'] = true;
        toolShape['stopDrawing']();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });
});
