import { Tool, ToolSetting } from './tool';

export class ToolTest extends Tool {
    penColor: string;

    constructor() {
        super();
        this.toolSettings.set(ToolSetting.Color, this.penColor);
    }

    onMouseMove(x: number, y: number): void {
        console.log('penis');
    }

    onMouseDown(x: number, y: number, button: number): void {}

    onMouseUp(x: number, y: number, button: number): void {}

    onKeyDown(key: string): void {}

    onKeyUp(key: string): void {}
}
