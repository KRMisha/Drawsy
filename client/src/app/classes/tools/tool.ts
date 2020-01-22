
export enum ToolSetting {
    Size = 1,
    Color,
}

export abstract class Tool {
    toolSettings = new Map();

    abstract onMouseMove(x: number, y: number): void;
    abstract onMouseDown(x: number, y: number, button: number): void;
    abstract onMouseUp(x: number, y: number, button: number): void;
    abstract onKeyDown(key: string): void;
    abstract onKeyUp(key: string): void;
}
