import { Injectable, Renderer2 } from '@angular/core';
import { ToolHolderService } from '../tool-holder/tool-holder.service';
import { StrokeTypes, Textures, Tool, ToolSetting } from '../tools/tool';

const numberRegex = new RegExp('^[0-9]+$');

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

    onLeave(event: MouseEvent): void {
        this.selectedTool.onLeave(event);
    }

    onEnter(event: MouseEvent): void {
        this.selectedTool.onEnter(event);
    }

    setMouseDown(isMouseDown: boolean): void {
        this.selectedTool.isMouseDown = isMouseDown;
    }

    setMouseInside(isMouseInside: boolean): void {
        this.selectedTool.isMouseInside = isMouseInside;
    }

    setRenderer(renderer: Renderer2) {
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

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures) {
<<<<<<< HEAD
        const isSizeTypeInvalid = setting === ToolSetting.Size && !numberRegex.test(value.toString());
        const isJunctionTypeInvalid = setting === ToolSetting.HasJunction && !numberRegex.test((value as [boolean, number])[1].toString());
        if (isSizeTypeInvalid || isJunctionTypeInvalid) {
=======
        const isSizeTypeValid = setting === ToolSetting.Size && numberRegex.test(value.toString());
        const isJunctionTypeValid = setting === ToolSetting.HasJunction && numberRegex.test((value as [boolean, number])[1].toString())
        if (!isSizeTypeValid || !isJunctionTypeValid) {
>>>>>>> a9e31e9b310c23ebf40f4768cb0ee78183c4e240
            return;
        }

        this.selectedTool.toolSettings.set(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.selectedTool.toolSettings.has(setting);
    }
}
