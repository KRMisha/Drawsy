import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { StrokeType, Texture, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

// tslint:disable: no-magic-numbers

class MockTool extends Tool {
    onMouseUp: () => {};
    onMouseDown: () => {};
    onMouseMove: () => {};
    onMouseDoubleClick: () => {};
    onKeyDown: () => {};
    onKeyUp: () => {};
    onLeave: () => {};
    onEnter: () => {};
    name: string;
    isMouseDown = false;
    isMouseInside = false;
    renderer: Renderer2;
    toolSettings = new Map<ToolSetting, number | JunctionSettings | StrokeType | Texture>();
}

// tslint:disable: max-classes-per-file
class MockToolHolderService {
    tools: Tool[] = [new MockTool({} as DrawingService), new MockTool({} as DrawingService), new MockTool({} as DrawingService)];
}
// tslint:enable: max-classes-per-file

describe('ToolSelectorService', () => {
    let service: ToolSelectorService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ToolHolderService, useValue: new MockToolHolderService() }],
        });
        service = TestBed.get(ToolSelectorService);
        service.selectedTool = new MockTool({} as DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should forward events to the selected tool', async(() => {
        spyOn(service.selectedTool, 'onMouseMove').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(service.selectedTool.onMouseMove).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onMouseDown').and.callThrough();
        service.onMouseDown({} as MouseEvent);
        expect(service.selectedTool.onMouseDown).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onMouseUp').and.callThrough();
        service.onMouseUp({} as MouseEvent);
        expect(service.selectedTool.onMouseUp).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onMouseDoubleClick').and.callThrough();
        service.onMouseDoubleClick({} as MouseEvent);
        expect(service.selectedTool.onMouseDoubleClick).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onKeyDown').and.callThrough();
        service.onKeyDown({} as KeyboardEvent);
        expect(service.selectedTool.onKeyDown).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onKeyUp').and.callThrough();
        service.onKeyUp({} as KeyboardEvent);
        expect(service.selectedTool.onKeyUp).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onEnter').and.callThrough();
        service.onEnter({} as MouseEvent);
        expect(service.selectedTool.onEnter).toHaveBeenCalled();

        spyOn(service.selectedTool, 'onLeave').and.callThrough();
        service.onLeave({} as MouseEvent);
        expect(service.selectedTool.onLeave).toHaveBeenCalled();
    }));

    it('should set selected tool status boolean', async(() => {
        spyOn(service, 'setMouseDown').and.callThrough();
        service.setMouseDown(true);
        expect(service.setMouseDown).toHaveBeenCalled();
        expect(service.selectedTool.isMouseDown).toEqual(true);

        spyOn(service, 'setMouseInside').and.callThrough();
        service.setMouseInside(true);
        expect(service.setMouseInside).toHaveBeenCalled();
        expect(service.selectedTool.isMouseInside).toEqual(true);
    }));

    it("should set its internal renderer and all of the tool holder's tools renderers to the passed renderer", () => {
        const toolHolderService = TestBed.get(ToolHolderService);
        spyOn(service, 'setRenderer').and.callThrough();
        service.setRenderer({} as Renderer2);
        expect(service.setRenderer).toHaveBeenCalled();
        expect(service.renderer).toEqual({} as Renderer2);
        expect(toolHolderService.tools[0].renderer).toEqual({} as Renderer2);
        expect(toolHolderService.tools[1].renderer).toEqual({} as Renderer2);
        expect(toolHolderService.tools[2].renderer).toEqual({} as Renderer2);
    });

    it('should set the internal selected tool', () => {
        const toolHolderService = TestBed.get(ToolHolderService);
        spyOn(service, 'setSelectedTool').and.callThrough();
        toolHolderService.tools[0] = {} as MockTool;
        service.selectedTool = new MockTool({} as DrawingService);
        service.setSelectedTool(0);
        expect(service.setSelectedTool).toHaveBeenCalled();
        expect(service.selectedTool).toEqual({} as MockTool);
    });

    it('should return selectedTool name', () => {
        spyOn(service, 'getToolName').and.callThrough();
        service.selectedTool.name = 'default';
        expect(service.getToolName()).toEqual('default');
        expect(service.getToolName).toHaveBeenCalled();
    });

    it('should return value mapped to the setting', () => {
        spyOn(service, 'getSetting').and.callThrough();
        service.selectedTool.toolSettings.set(ToolSetting.Size, 3);
        expect(service.getSetting(ToolSetting.Size)).toEqual(3);
        expect(service.getSetting).toHaveBeenCalled();
    });

    it('should set value mapped to the setting', () => {
        spyOn(service, 'setSetting').and.callThrough();
        service.selectedTool.toolSettings.set(ToolSetting.Size, 3);
        service.setSetting(ToolSetting.Size, 4);
        expect(service.selectedTool.toolSettings.get(ToolSetting.Size)).toEqual(4);
        expect(service.setSetting).toHaveBeenCalled();
    });

    it('should only set value mapped to the setting if it exists and is valid', () => {
        expect(service.hasSetting(ToolSetting.Size)).toEqual(false);

        spyOn(service, 'setSetting').and.callThrough();
        service.selectedTool.toolSettings.set(ToolSetting.HasJunction, [true, 3]);
        service.setSetting(ToolSetting.HasJunction, [false, -1]);
        expect(service.getSetting(ToolSetting.HasJunction)).toEqual([true, 3]);
        expect(service.setSetting).toHaveBeenCalled();
    });

    it('should return setting exists in map', () => {
        spyOn(service, 'hasSetting').and.callThrough();
        service.selectedTool.toolSettings.set(ToolSetting.Size, 3);
        expect(service.hasSetting(ToolSetting.Size)).toEqual(true);
        expect(service.hasSetting(ToolSetting.HasJunction)).toEqual(false);
        expect(service.hasSetting).toHaveBeenCalled();
    });
});
