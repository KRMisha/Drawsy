import { Tool } from '../tools/tool';
import { InputLogger } from '../tools/input-logger';
import { ToolTest } from '../tools/tool-test';

export class Button {
    name: string;
    tool: Tool;
}

export const BUTTONS: Button[] = [
    { name: 'Crayon', tool: new InputLogger() },
    { name: 'Pinceau', tool: new ToolTest() },
];
