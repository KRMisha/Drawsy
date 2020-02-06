import { Injectable, Renderer2 } from '@angular/core';
import { ToolHolderService } from '../tool-holder/tool-holder.service';
import { Tool } from '../tools/tool';

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
        this.selectedTool.setMouseDown(isMouseDown);
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
}
