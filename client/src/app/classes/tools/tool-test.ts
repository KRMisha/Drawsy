import { Tool, ToolSetting } from './tool';

export class ToolTest extends Tool {
    penColor = 5;
    penSize = 5;

    constructor() {
        super();
        this.toolSettings.set(ToolSetting.Color, this.penColor);
        this.toolSettings.set(ToolSetting.Size, this.penSize);
    }

    onMouseMove(x: number, y: number): void {
        console.log('test');
    }

    /* tslint:disable:no-empty */
    onMouseDown(x: number, y: number, button: number): void {}

    onMouseUp(x: number, y: number, button: number): void {}

    onKeyDown(key: string): void {}

    onKeyUp(key: string): void {}
}
