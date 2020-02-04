import { Injectable, Injector, Renderer2 } from '@angular/core';
import { tools } from '../../../classes/tools/tools';
import { Tool } from '../tools/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    renderer: Renderer2;
    selectedTool: Tool;

    constructor(private injector: Injector) {
        // const token = new InjectionToken<Tool>(tools[0]);
        this.selectedTool = this.injector.get(tools[0]);
    }

    onMouseMove(event: MouseEvent): void {
        this.selectedTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.selectedTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.selectedTool.onMouseUp(event);
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

    setSelectedTool(toolIndex: number): void {
        this.selectedTool = this.injector.get(tools[toolIndex]);
        this.selectedTool.renderer = this.renderer;
    }
}
