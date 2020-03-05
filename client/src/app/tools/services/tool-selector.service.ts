import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { SvgClickEvent } from '@app/drawing/classes/svg-click-event';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { StrokeType, Texture, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService implements OnDestroy {
    renderer: Renderer2;
    selectedTool: Tool;

    private primaryColorSubscription: Subscription;
    private secondaryColorSubscription: Subscription;
    private elementClickSubscription: Subscription;
    private elementHoverSubscription: Subscription;

    constructor(private toolHolderService: ToolHolderService, private colorService: ColorService, private drawingService: DrawingService) {
        this.primaryColorSubscription = this.colorService.primaryColorChanged$.subscribe((color: Color) => {
            this.selectedTool.onPrimaryColorChange(color);
        });

        this.secondaryColorSubscription = this.colorService.secondaryColorChanged$.subscribe((color: Color) => {
            this.selectedTool.onSecondaryColorChange(color);
        });

        this.elementClickSubscription = this.drawingService.elementClicked$.subscribe((svgClickEvent: SvgClickEvent) => {
            this.selectedTool.onElementClick(svgClickEvent.mouseEvent, svgClickEvent.svgElement);
        });

        this.elementClickSubscription = this.drawingService.elementHovered$.subscribe((svgElement: SVGElement) => {
            this.selectedTool.onElementHover(svgElement);
        });
    }

    ngOnDestroy(): void {
        this.primaryColorSubscription.unsubscribe();
        this.secondaryColorSubscription.unsubscribe();
        this.elementClickSubscription.unsubscribe();
        this.elementHoverSubscription.unsubscribe();
    }

    afterDrawingInit(): void {
        for (const tool of this.toolHolderService.tools) {
            tool.afterDrawingInit();
        }
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
        if (this.selectedTool) {
            this.selectedTool.onToolDeselection();
        }
        this.selectedTool = this.toolHolderService.tools[toolIndex];
    }

    getToolName(): string {
        return this.selectedTool.name;
    }

    getSetting(setting: ToolSetting): number | JunctionSettings | StrokeType | Texture {
        const value = this.selectedTool.toolSettings.get(setting);
        return value as number | JunctionSettings | StrokeType | Texture;
    }

    setSetting(setting: ToolSetting, value: number | JunctionSettings | StrokeType | Texture): void {
        this.selectedTool.toolSettings.set(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.selectedTool.toolSettings.has(setting);
    }
}
