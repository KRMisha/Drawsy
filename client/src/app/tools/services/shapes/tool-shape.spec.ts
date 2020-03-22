import { Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';
// import { Tool } from '@app/tools/services/tool';

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
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolShape: ToolShapeMock;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
            'addElement',
            'removeElement'
        ], [
            'drawingRoot'
        ]);

        const drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', [
            'getBoundingClientRect'
        ]);
        drawingRootSpyObj.getBoundingClientRect.and.returnValue({x: 0, y: 0} as DOMRect);
        drawingServiceSpyObj.drawingRoot = drawingRootSpyObj;

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', [
            'addCommand'
        ]);

        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', [
            'createRenderer'
        ]);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', [
            'setAttribute',
            'createElement'
        ]);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        const colorServiceStub = {} as ColorService;
        toolShape = new ToolShapeMock(
            rendererFactory2SpyObj,
            drawingServiceSpyObj,
            colorServiceStub,
            commandServiceSpyObj,
            name,
            isShapeAlwaysRegular
        );
    });

    it('should create an instance', () => {
        expect(toolShape).toBeTruthy();
    });

    it('#onPrimaryColorChange should call color.toRgbaString and renderer.setAttribute with the proper arguments', () => {
        const color = jasmine.createSpyObj('Color', ['toRgbaString']);
        color.toRgbaString.and.returnValue('rgba(0, 0, 0 ,1)');
        const shape = {} as SVGElement;
        toolShape['shape'] = shape; // tslint:disable-line: no-string-literal
        toolShape.onPrimaryColorChange(color);
        expect(color.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'fill', 'rgba(0, 0, 0 ,1)');
    });

    it('#onPrimaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        const color = {} as Color;
        toolShape.onPrimaryColorChange(color);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onSecondaryColorChange should call renderer.setAtcolor.toRgbaString and renderer.setAttribute with the proper arguments', () => {
        const color = jasmine.createSpyObj('Color', ['toRgbaString']);
        color.toRgbaString.and.returnValue('rgba(0, 0, 0 ,1)');
        const color12 = Color.fromRgb(1, 1, 1);
        spyOn(color12, 'toRgbString').and.callThrough();
        const shape = {} as SVGElement;
        toolShape['shape'] = shape; // tslint:disable-line: no-string-literal
        toolShape.onSecondaryColorChange(color);
        expect(color.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'stroke', 'rgba(0, 0, 0 ,1)');
    });

    it('#onSecondaryColorChange should not call renderer.setAttribute if shape is undefined', () => {
        const color = {} as Color;
        toolShape.onSecondaryColorChange(color);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    // it('#onMouseMove should call #getMousePosition and #updateShapeArea', () => {
    //     spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
    //     Tool.isMouseDown = true;
    //     toolShape.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(toolShape['updateShapeArea']).toHaveBeenCalled(); // tslint:disable-line: no-string-literal
    // });

    // it('#onMouseDown should call drawingService.addElement with the proper arguments', () => {
    //     Tool.isMouseInsideDrawing = true;
    //     toolShape.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
    //     expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith();
    // });

    it('#onMouseUp should call commandService.addCommand if shape is a valid regular shape', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = true;
        toolShape['mousePosition'] = { x: 1, y: 1 } as Vec2;
        toolShape['origin'] = { x: 0, y: 0 } as Vec2;
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onMouseUp should call commandService.addCommand if shape is a valid non regular shape', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['isShiftDown'] = false;
        toolShape['mousePosition'] = { x: 1, y: 1 } as Vec2;
        toolShape['origin'] = { x: 0, y: 0 } as Vec2;
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onMouseUP should call drawingService.removeElement if shape is a non valid shape', () => {
        const shape = {} as SVGElement;
        // tslint:disable: no-string-literal
        toolShape['shape'] = shape;
        toolShape['mousePosition'] = { x: 0, y: 0 } as Vec2;
        toolShape['origin'] = { x: 0, y: 0 } as Vec2;
        // tslint:enable: no-string-literal
        toolShape.onMouseUp({ button: ButtonId.Left, offsetX: 0, offsetY: 0 } as MouseEvent);
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });

    it('#onKeyDown should call #updateShapeArea and set isShiftDown to true', () => {
        toolShape['isShiftDown'] = false; // tslint:disable-line: no-string-literal
        spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
        toolShape.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(true); // tslint:disable-line: no-string-literal
        expect(toolShape['updateShapeArea']).toHaveBeenCalled(); // tslint:disable-line: no-string-literal
    });

    it('#onKeyUp should call #updateShapeArea and set isShiftDown to false', () => {
        toolShape['isShiftDown'] = true; // tslint:disable-line: no-string-literal
        spyOn<any>(toolShape, 'updateShapeArea').and.callThrough(); // tslint:disable-line: no-any
        toolShape.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(toolShape['isShiftDown']).toEqual(false); // tslint:disable-line: no-string-literal
        expect(toolShape['updateShapeArea']).toHaveBeenCalled(); // tslint:disable-line: no-string-literal
    });
});
