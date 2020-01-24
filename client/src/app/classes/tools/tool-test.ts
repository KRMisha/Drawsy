import { Tool, ToolSetting } from './tool';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { Rectangle } from '../shapes/rectangle';

export class ToolTest extends Tool {
    penColor = 5;
    penSize = 5;

    constructor() {
        super();
        this.toolSettings.set(ToolSetting.Color, this.penColor);
        this.toolSettings.set(ToolSetting.Size, this.penSize);
    }

    onMouseMove(event: MouseEvent, drawingService: DrawingService): void {}

    onMouseDown(event: MouseEvent, drawingService: DrawingService): void {
        drawingService.addShape(new Rectangle());
    }

    onMouseUp(event: MouseEvent, drawingService: DrawingService): void {}

    onKeyDown(event: KeyboardEvent, drawingService: DrawingService): void {}

    onKeyUp(event: KeyboardEvent, drawingService: DrawingService): void {}
}
