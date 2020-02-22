import { Renderer2 } from '@angular/core';
import { DrawingService } from '../../drawing/services/drawing.service';

export enum ToolSetting {
    Size,
    HasJunction,
    StrokeType,
    Texture,
}

export enum Textures {
    Texture1 = 1,
    Texture2,
    Texture3,
    Texture4,
    Texture5,
}

export enum StrokeTypes {
    FillWithBorder,
    FillOnly,
    BorderOnly,
}

export abstract class Tool {
    renderer: Renderer2;
    toolSettings = new Map<ToolSetting, number | [boolean, number] | StrokeTypes | Textures>();
    name: string;
    isMouseDown = false;
    isMouseInside = false;

    constructor(protected drawingService: DrawingService) {}

    // Deactivate tslint for method stubs below because not all derived service classes
    // may need to override the functionality and would needlessly define no-ops otherwise
    // tslint:disable: no-empty
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseDoubleClick(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
    onEnter(event: MouseEvent): void {}
    onLeave(event: MouseEvent): void {}
    // tslint:enable: empty
}