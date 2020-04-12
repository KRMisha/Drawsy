import { Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { ToolData } from '@app/tools/classes/tool-data';
import { Tool } from '@app/tools/services/tool';

// tslint:disable: no-magic-numbers

class ToolMock extends Tool {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        toolInfo: ToolData
    ) {
        super(rendererFactory, drawingService, colorService, historyService, toolInfo);
    }
}

describe('Tool', () => {
    let tool: ToolMock;
    let rendererFactory2SpyObj: jasmine.SpyObj<RendererFactory2>;

    const toolInfo: ToolData = { name: 'TestName', icon: 'test_icon' };

    beforeEach(() => {
        rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(({ yay: 'Hello world!' } as unknown) as Renderer2);

        const drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['']);
        const colorServiceSpyObj = jasmine.createSpyObj('ColorService', ['']);
        const historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['']);

        tool = new ToolMock(rendererFactory2SpyObj, drawingServiceSpyObj, colorServiceSpyObj, historyServiceSpyObj, toolInfo);
    });

    it('should be created', () => {
        expect(tool).toBeTruthy();
    });

    it('#constructor should create its renderer and set its name and icon', () => {
        expect(rendererFactory2SpyObj.createRenderer).toHaveBeenCalledWith(null, null);
        expect(tool['renderer']).toBeTruthy(); // tslint:disable-line: no-string-literal
        expect(tool.name).toEqual(toolInfo.name);
        expect(tool.icon).toEqual(toolInfo.icon);
    });

    it('#onMouseMove should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseMove').and.callThrough();
        tool.onMouseMove({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseDown').and.callThrough();
        tool.onMouseDown({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onMouseUp should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseUp').and.callThrough();
        tool.onMouseUp({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onScroll should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onScroll').and.callThrough();
        tool.onScroll({} as WheelEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onMouseDoubleClick should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseDoubleClick').and.callThrough();
        tool.onMouseDoubleClick({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onKeyDown').and.callThrough();
        tool.onKeyDown({} as KeyboardEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onKeyUp').and.callThrough();
        tool.onKeyUp({} as KeyboardEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onMouseEnter should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseEnter').and.callThrough();
        tool.onMouseEnter({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onMouseLeave should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onMouseLeave').and.callThrough();
        tool.onMouseLeave({} as MouseEvent);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onPrimaryColorChange should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onPrimaryColorChange').and.callThrough();
        tool.onPrimaryColorChange({} as Color);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onSecondaryColorChange should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onSecondaryColorChange').and.callThrough();
        tool.onSecondaryColorChange({} as Color);
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#update should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'update').and.callThrough();
        tool.update();
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onToolSelection should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onToolSelection').and.callThrough();
        tool.onToolSelection();
        expect(methodStubSpy).toHaveBeenCalled();
    });

    it('#onToolDeselection should be called when called', () => {
        const methodStubSpy = spyOn(tool, 'onToolDeselection').and.callThrough();
        tool.onToolDeselection();
        expect(methodStubSpy).toHaveBeenCalled();
    });
});
