import { Renderer2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { JunctionSettings } from '@app/editor/classes/junction-settings';
import { StrokeTypes, Textures, ToolSetting } from '@app/tools/enums/tool-settings.enum';

export abstract class Tool {
    renderer: Renderer2; // tslint:disable-line: variable-name
    toolSettings = new Map<ToolSetting, number | JunctionSettings | StrokeTypes | Textures>();
    name: string;
    isMouseDown = false;
    isMouseInside = false;

    constructor(protected drawingService: DrawingService, name: string) {
        this.name = name;
    }

    // Deactivate tslint for method stubs below because not all derived service classes
    // may need to override the functionality and would needlessly define no-ops otherwise
    // tslint:disable: no-empty
    onRendererInit(): void {}
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
    // tslint:enable: empty
}
