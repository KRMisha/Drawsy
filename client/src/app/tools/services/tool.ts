import { Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';

export abstract class Tool {
    static isMouseDown = false;
    static isMouseInsideDrawing = false;

    name: ToolName;
    toolSettings = new Map<ToolSetting, number | JunctionSettings | ShapeType | BrushTexture>();

    protected renderer: Renderer2;

    constructor(
        private rendererFactory: RendererFactory2,
        protected drawingService: DrawingService,
        protected colorService: ColorService,
        protected commandService: CommandService,
        name: ToolName
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.name = name;
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
    onElementClick(event: MouseEvent, element: SVGElement): void {}
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
