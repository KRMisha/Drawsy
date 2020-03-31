import { Renderer2, RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolData } from '@app/tools/classes/tool-data';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';
import { Tool } from '@app/tools/services/tool';

// tslint:disable: no-any
// tslint:disable: no-string-literal

class ToolBrushMock extends ToolBrush {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        toolInfo: ToolData
    ) {
        super(rendererFactory, drawingService, colorService, commandService, toolInfo);
        this.settings.lineWidth = ToolDefaults.defaultLineWidth;
    }
}

fdescribe('ToolBrush', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolBrush: ToolBrushMock;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let updatePathSpy: jasmine.Spy;

    const rgbaStringValue = 'rgba(69, 69, 69, 1)';

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement']);

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['getAttribute', 'setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(rgbaStringValue);

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(rgbaStringValue);
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: colorSpyObj,
            secondaryColor: colorSpyObj,
        });

        toolBrush = new ToolBrushMock(
            rendererFactory2SpyObj,
            drawingServiceSpyObj,
            colorServiceSpyObj,
            commandServiceSpyObj,
            ToolInfo.Pencil
        );
        // toolBrushPathGetAttributeSpy = spyOn<any>(toolBrush['path'], 'getAttribute').and.callThrough();
        updatePathSpy = spyOn<any>(toolBrush, 'updatePath').and.callThrough();
    });

    it('should be created', () => {
        expect(toolBrush).toBeTruthy();
    });

    it('#onMouseMove should call #updatePath if isLeftMouseButtonDown and isMouseInsideDrawing from Tool are true', () => {
        Tool.isLeftMouseButtonDown = true;
        Tool.isMouseInsideDrawing = true;

        toolBrush.onMouseMove();

        expect(updatePathSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should not call #updatePath if isLeftMouseButtonDown or isMouseInsideDrawing from Tool is false', () => {
        Tool.isLeftMouseButtonDown = false;
        Tool.isMouseInsideDrawing = true;

        toolBrush.onMouseMove();

        expect(updatePathSpy).not.toHaveBeenCalled();
    });

    it("#onMouseDown should call #updatePath and drawingService's addElement on left click inside drawing surface", () => {
        Tool.isMouseInsideDrawing = true;
        const createPathSpy = spyOn<any>(toolBrush, 'createPath').and.callThrough();
        toolBrush.onMouseDown({ button: MouseButton.Left } as MouseEvent);

        expect(updatePathSpy).toHaveBeenCalled();
        expect(createPathSpy).toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it("#onMouseDown should not call #updatePath and drawingService's addElement on right click", () => {
        Tool.isMouseInsideDrawing = true;
        const createPathSpy = spyOn<any>(toolBrush, 'createPath').and.callThrough();
        toolBrush.onMouseDown({ button: MouseButton.Right } as MouseEvent);

        expect(updatePathSpy).not.toHaveBeenCalled();
        expect(createPathSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it("#onMouseDown should not call #updatePath and drawingService's addElement if mouse is not inside the drawing surface", () => {
        Tool.isMouseInsideDrawing = false;
        const createPathSpy = spyOn<any>(toolBrush, 'createPath').and.callThrough();
        toolBrush.onMouseDown({ button: MouseButton.Left } as MouseEvent);

        expect(updatePathSpy).not.toHaveBeenCalled();
        expect(createPathSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call #stopDrawing on left click', () => {
        const stopDrawingSpy = spyOn<any>(toolBrush, 'stopDrawing').and.callThrough();
        toolBrush.onMouseUp({ button: MouseButton.Left } as MouseEvent);

        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#onMouseUp should not call #stopDrawing on right click', () => {
        const stopDrawingSpy = spyOn<any>(toolBrush, 'stopDrawing').and.callThrough();
        toolBrush.onMouseUp({ button: MouseButton.Right } as MouseEvent);

        expect(stopDrawingSpy).not.toHaveBeenCalled();
    });

    it('#onLeave should call #updatePath and #stopDrawing if left click is held', () => {
        const stopDrawingSpy = spyOn<any>(toolBrush, 'stopDrawing').and.callThrough();
        Tool.isLeftMouseButtonDown = true;
        toolBrush.onLeave({ button: MouseButton.Left } as MouseEvent);

        expect(updatePathSpy).toHaveBeenCalled();
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#onLeave should not call #updatePath and #stopDrawing if left click is not held', () => {
        const stopDrawingSpy = spyOn<any>(toolBrush, 'stopDrawing').and.callThrough();
        Tool.isLeftMouseButtonDown = false;
        toolBrush.onLeave({ button: MouseButton.Right } as MouseEvent);

        expect(updatePathSpy).not.toHaveBeenCalled();
        expect(stopDrawingSpy).not.toHaveBeenCalled();
    });

    it("#onPrimaryColorChange should set the path's stroke color with the parameter's color if the path is not undefined", () => {
        const brush = {} as SVGPathElement;
        toolBrush['path'] = brush;
        toolBrush.onPrimaryColorChange(colorSpyObj);

        expect(colorSpyObj.toRgbaString).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(brush, 'stroke', rgbaStringValue);
    });

    it('#onPrimaryColorChange should not call renderer.setAttribute if path is undefined', () => {
        toolBrush['path'] = undefined;
        toolBrush.onPrimaryColorChange(colorSpyObj);

        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#updatePath should not do anything if the path is undefined', () => {
        toolBrush['path'] = undefined;
        toolBrush['updatePath']();
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#updatePath should call set the path attribute if the path exists', () => {
        let pathSpyObj: jasmine.SpyObj<SVGPathElement>;
        pathSpyObj = jasmine.createSpyObj('SVGPathElement', ['getAttribute']);
        pathSpyObj.getAttribute.and.returnValue('M0 0');
        const mousePosition = 10;

        toolBrush['path'] = pathSpyObj;

        Tool.mousePosition.x = mousePosition;
        Tool.mousePosition.y = mousePosition;

        toolBrush['updatePath']();

        expect(updatePathSpy).toHaveBeenCalledWith();
        expect(pathSpyObj.getAttribute).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(pathSpyObj, 'd', 'M0 0 L10 10');
    });

    it('#stopDrawing should early return if the path is undefined', () => {
        toolBrush['path'] = undefined;

        toolBrush['stopDrawing']();

        expect(commandServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#stopDrawing should add a command in commandService and set path to undefined if the path is not already undefined', () => {
        const pathMock = {} as SVGPathElement;
        toolBrush['path'] = pathMock;

        toolBrush['stopDrawing']();

        expect(commandServiceSpyObj.addCommand).toHaveBeenCalledWith(new AppendElementCommand(drawingServiceSpyObj, pathMock));
        expect(toolBrush['path']).not.toBeTruthy();
    });
});
