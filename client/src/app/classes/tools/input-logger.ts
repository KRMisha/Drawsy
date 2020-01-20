import { Tool, ToolSetting } from './tool';

export class InputLogger extends Tool {
    penSize = 5;

    constructor() {
        super();
        this.toolSettings.set(ToolSetting.Size, this.penSize);
    }

    onMouseMove(x: number, y: number): void {
        console.log(`Mouse move -> X: ${x} Y: ${y}`);
    }

    onMouseDown(x: number, y: number, button: number): void {
        console.log(`Mouse down -> X: ${x} Y: ${y} Btn: ${button}`);
    }

    onMouseUp(x: number, y: number, button: number): void {
        console.log(`Mouse up -> X: ${x} Y: ${y} Btn: ${button}`);
    }

    onKeyDown(key: string): void {
        console.log(`Key down: ${key}`);
    }

    onKeyUp(key: string): void {
        console.log(`Key up: ${key}`);
    }
}
