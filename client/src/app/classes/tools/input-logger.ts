import { Tool, ToolSetting } from './tool';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
// import { DrawingService } from 'src/app/services/drawing/drawing.service';

export class InputLogger extends Tool {
    penSize = 5;

    constructor() {
        super();
        this.toolSettings.set(ToolSetting.Size, this.penSize);
    }

    onMouseMove(event: MouseEvent, drawingService: DrawingService): void {
        console.log(`Mouse move -> X: ${event.clientX} Y: ${event.clientY}`);
    }

    onMouseDown(event: MouseEvent, drawingService: DrawingService): void {
    }

    onMouseUp(event: MouseEvent, drawingService: DrawingService): void {
    }

    onKeyDown(event: KeyboardEvent, drawingService: DrawingService): void {
    }

    onKeyUp(event: KeyboardEvent, drawingService: DrawingService): void {
    }
}
