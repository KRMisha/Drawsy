import { Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolData } from '@app/tools/classes/tool-data';
import { ToolSettings } from '@app/tools/classes/tool-settings';

export abstract class Tool {
    static isLeftMouseButtonDown = false;
    static isMouseInsideDrawing = false;

    name: string;
    icon: string;
    settings: ToolSettings = {};

    protected renderer: Renderer2;

    constructor(
        rendererFactory: RendererFactory2,
        protected drawingService: DrawingService,
        protected colorService: ColorService,
        protected commandService: CommandService,
        toolInfo: ToolData
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        ({ name: this.name, icon: this.icon } = toolInfo);
    }

    // Disable tslint for method stubs below because not all derived service classes
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
    onElementClick(event: MouseEvent, element: SVGGraphicsElement): void {}
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
