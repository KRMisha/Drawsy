import { Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { StrokeType, Texture, ToolSetting } from '@app/tools/enums/tool-settings.enum';

export abstract class Tool {
    renderer: Renderer2;
    toolSettings = new Map<ToolSetting, number | JunctionSettings | StrokeType | Texture>();
    name: string;
    isMouseDown = false;
    isMouseInside = false;

    constructor(protected drawingService: DrawingService, name: string) {
        this.name = name;
    }

    // Deactivate tslint for method stubs below because not all derived service classes
    // may need to override the functionality and would needlessly define no-ops otherwise
    // tslint:disable: no-empty
    afterDrawingInit(): void {}
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseDoubleClick(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
    onEnter(event: MouseEvent): void {}
    onLeave(event: MouseEvent): void {}
    onPrimaryColorChange(color: Color): void {}
    onSecondaryColorChange(color: Color): void {}
    onElementClick(event: MouseEvent, element: SVGElement): void {}
    onElementHover(element: SVGElement): void {}
    onToolDeselection(): void {}
    // tslint:enable: no-empty

    protected getMousePosition(event: MouseEvent): Vec2 {
        const rootBounds = this.drawingService.drawingRoot.getBoundingClientRect() as DOMRect;
        return {
            x: event.clientX - rootBounds.x,
            y: event.clientY - rootBounds.y,
        } as Vec2;
    }
}
