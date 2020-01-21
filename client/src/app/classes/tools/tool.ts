import { DrawingService } from 'src/app/services/drawing/drawing.service';

export enum ToolSetting {
    Size = 1,
    Color,
}

export abstract class Tool {

    toolSettings = new Map();

    constructor() {

    }

    abstract onMouseMove(event: MouseEvent, drawingService: DrawingService): void;
    abstract onMouseDown(event: MouseEvent, drawingService: DrawingService): void;
    abstract onMouseUp(event: MouseEvent, drawingService: DrawingService): void;
    abstract onKeyDown(event: KeyboardEvent, drawingService: DrawingService): void;
    abstract onKeyUp(event: KeyboardEvent, drawingService: DrawingService): void;
}
