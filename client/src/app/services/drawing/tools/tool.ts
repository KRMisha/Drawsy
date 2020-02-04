import { Renderer2 } from '@angular/core';
import { DrawingService } from '../drawing.service';

export enum ToolSettings {
    Size = 1,
    Color,
}

export abstract class Tool {
    renderer: Renderer2;
    toolSettings = new Map();
    isMouseDown = false;

    constructor(protected drawingService: DrawingService) {}

    // Deactivate tslint for method stubs below because not all derived service classes
    // may need to override the functionality and would needlessly define no-ops otherwise
    // tslint:disable: no-empty
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
    onEnter(event: MouseEvent): void {}
    onLeave(event: MouseEvent): void {}
    // tslint:enable: empty

    setMouseDown(isMouseDown: boolean): void {
        this.isMouseDown = isMouseDown;
    }
}
