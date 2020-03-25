import { Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';
import { Tool } from '@app/tools/services/tool';

class ToolShapeMock extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        name: ToolName,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, commandService, name, isShapeAlwaysRegular);
    }
    getShapeString(): string {
        return '';
    }
    updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        return;
    }
}

describe('ToolShape', () => {
    const name: ToolName = ToolName.Brush;
    const isShapeAlwaysRegular = false;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let toolShape: ToolShapeMock;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement']);

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);

        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        colorServiceSpyObj = jasmine.createSpyObj('ColorService', ['getPrimaryColor', 'getSecondaryColor']);
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue('rgba(0, 0, 0 ,1)');
        colorServiceSpyObj.getPrimaryColor.and.returnValue(colorSpyObj);
        colorServiceSpyObj.getSecondaryColor.and.returnValue(colorSpyObj);

        toolShape = new ToolShapeMock(
            rendererFactory2SpyObj,
            drawingServiceSpyObj,
            colorServiceSpyObj,
            commandServiceSpyObj,
            name,
            isShapeAlwaysRegular
        );
    });

    it('should create an instance', () => {
        expect(toolShape).toBeTruthy();
    });

    it('#onPrimaryColorChange should call color.toRgbaString and renderer.setAttribute with the proper arguments', () => {
        const shape = {} as SVGElement;
        toolShape['shape'] = shape; // tslint:disable-line: no-string-literal
        toolShape.onPrimaryColorChange(colorSpyObj);
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'fill', 'rgba(0, 0, 0 ,1)');
    });

    it('#onPrimaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        toolShape['shape'] = undefined; // tslint:disable-line: no-string-literal
        toolShape.onPrimaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onSecondaryColorChange should call renderer.setAtcolor.toRgbaString and renderer.setAttribute with the proper arguments', () => {
        const shape = {} as SVGElement;
        toolShape['shape'] = shape; // tslint:disable-line: no-string-literal
        toolShape.onSecondaryColorChange(colorSpyObj);
        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'stroke', 'rgba(0, 0, 0 ,1)');
    });

    it('#onSecondaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        toolShape['shape'] = undefined; // tslint:disable-line: no-string-literal
        toolShape.onSecondaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onMouseMove should call #getMousePosition and #updateShapeArea with mousePosition left and below origin', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['origin'] = { x: -50, y: -50 };
        // tslint:enable: no-string-literal
        // tslint:disable: no-any
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        const getMousePositionSpy = spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: -10, y: -10 });
        // tslint:enable: no-any
        Tool.isMouseDown = true;
        const mouseEvent = { offsetX: 5, offsetY: 5 } as MouseEvent;
        toolShape.onMouseMove(mouseEvent);
        expect(getMousePositionSpy).toHaveBeenCalledWith(mouseEvent);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should call #getMousePosition and #updateShapeArea with mousePosition right and above origin', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['origin'] = { x: 50, y: 50 } as Vec2;
        // tslint:enable: no-string-literal
        // tslint:disable: no-any
        const updateShapeAreanSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        const getMousePositionSpy = spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: -10, y: -10 });
        // tslint:enable: no-any
        Tool.isMouseDown = true;
        const mouseEvent = { offsetX: 5, offsetY: 5 } as MouseEvent;
        toolShape.onMouseMove(mouseEvent);
        expect(updateShapeAreanSpy).toHaveBeenCalled();
        expect(getMousePositionSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('#onMouseMove should not call #updateShapeArea if the mouse is not down', () => {
        // tslint:disable: no-any
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: 0, y: 0 });
        // tslint:enable: no-any
        Tool.isMouseDown = false;
        const mouseEvent = { offsetX: 20, offsetY: 20 } as MouseEvent;
        toolShape.onMouseMove(mouseEvent);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should call private functions and drawingService.addElement with the proper arguments with the BorderOnly shapeType',
    () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['origin'] = { x: 0, y: 0 };
        // tslint:enable: no-string-literal
        // tslint:disable: no-any
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        const getMousePositionSpy = spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: 50, y: 50 });
        const createNewShapeSpy = spyOn<any>(toolShape, 'createNewShape').and.callThrough();
        // tslint:enable: no-any

        Tool.isMouseInsideDrawing = true;
        toolShape.toolSettings.set(ToolSetting.ShapeType, ShapeType.BorderOnly);
        toolShape.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(createNewShapeSpy).toHaveBeenCalled();
        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it('#onMouseDown should call private functions and drawingService.addElement with the proper arguments with the fillOnly shapeType',
    () => {
        const shape = {} as SVGElement;
        toolShape['shape'] = shape; // tslint:disable-line: no-string-literal
        // tslint:disable: no-any
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        const getMousePositionSpy = spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: 0, y: 0 });
        const createNewShapeSpy = spyOn<any>(toolShape, 'createNewShape').and.callThrough();
        // tslint:enable: no-any
        Tool.isMouseInsideDrawing = true;
        toolShape.toolSettings.set(ToolSetting.ShapeType, ShapeType.FillOnly);
        toolShape.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(createNewShapeSpy).toHaveBeenCalled();
        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(updateShapeAreaSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it('#onMouseDown should not make calls if the mouse isnt inside the drawing', () => {
        spyOn<any>(toolShape, 'getMousePosition').and.returnValue({ x: 0, y: 0 }); // tslint:disable-line: no-any
        Tool.isMouseInsideDrawing = false;
        toolShape.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call commandService.addCommand if shape is a valid regular shape (mouse.x is different from origin.x)', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['mousePosition'] = { x: 1, y: 0 };
        toolShape['origin'] = { x: 0, y: 0 };
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onMouseUp should call commandService.addCommand if shape is a valid regular shape (mouse.y is different from origin.y)', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['mousePosition'] = { x: 0, y: 1 };
        toolShape['origin'] = { x: 0, y: 0 };
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onMouseUp should call commandService.addCommand if shape is a valid non regular shape', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = false;
        toolShape['mousePosition'] = { x: 1, y: 1 };
        toolShape['origin'] = { x: 0, y: 0 };
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onMouseUp should call drawingService.removeElement if shape is a non valid shape', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['mousePosition'] = { x: 0, y: 0 };
        toolShape['origin'] = { x: 0, y: 0 };
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 0, offsetY: 0 } as MouseEvent);
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });

    it('#onMouseUp should not make any calls if the left mouse button isnt down', () => {
        toolShape.onMouseUp({ button: ButtonId.Right, offsetX: 0, offsetY: 0 } as MouseEvent);
        expect(drawingServiceSpyObj.removeElement).not.toHaveBeenCalled();
    });

    it('#onKeyDown should call #updateShapeArea and set isShiftDown to true', () => {
        // tslint:disable: no-string-literal
        toolShape['isShiftDown'] = false;
        // tslint:disable-next-line: no-any
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough();
        toolShape.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(true);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
        // tslint:enable: no-string-literal
    });

    it('#onKeyDown should not make any calls if the shift key isnt pressed', () => {
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
        toolShape.onKeyDown({ key: 'Enter' } as KeyboardEvent);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
    });

    it('#onKeyUp should call #updateShapeArea and set isShiftDown to false with isShapeAlwaysRegular as false', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['isShapeAlwaysRegular'] = false;
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
        toolShape.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(false);
        expect(updateShapeAreaSpy).toHaveBeenCalled();
        // tslint:enable: no-string-literal
    });

    it('#onKeyUp should not make any calls if the shift key isnt pressed', () => {
        const updateShapeAreaSpy = spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
        toolShape.onKeyUp({ key: 'Enter' } as KeyboardEvent);
        expect(updateShapeAreaSpy).not.toHaveBeenCalled();
    });
});
