import { Injectable, Renderer2 } from '@angular/core';
import { StrokeTypes, Textures, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    renderer: Renderer2;
    selectedTool: Tool;

    constructor(private toolHolderService: ToolHolderService) {}

    onMouseMove(event: MouseEvent): void {
        this.selectedTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.selectedTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.selectedTool.onMouseUp(event);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.selectedTool.onMouseDoubleClick(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.selectedTool.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.selectedTool.onKeyUp(event);
    }

    onEnter(event: MouseEvent): void {
        this.selectedTool.onEnter(event);
    }

    onLeave(event: MouseEvent): void {
        this.selectedTool.onLeave(event);
    }

    setMouseDown(isMouseDown: boolean): void {
        this.selectedTool.isMouseDown = isMouseDown;
    }

    setMouseInside(isMouseInside: boolean): void {
        this.selectedTool.isMouseInside = isMouseInside;
    }

    setRenderer(renderer: Renderer2): void {
        this.renderer = renderer;
        for (const tool of this.toolHolderService.tools) {
            tool.renderer = this.renderer;
        }
    }

    setSelectedTool(toolIndex: number): void {
        this.selectedTool = this.toolHolderService.tools[toolIndex];
    }

    getToolName(): string {
        return this.selectedTool.name;
    }

    getSetting(setting: ToolSetting): number | [boolean, number] | StrokeTypes | Textures {
        const value = this.selectedTool.toolSettings.get(setting);
        return value as number | [boolean, number] | StrokeTypes | Textures;
    }

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures): void {
        this.selectedTool.toolSettings.set(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.selectedTool.toolSettings.has(setting);
    }
}
