import { InputLogger } from '../tools/input-logger';
import { Tool } from '../tools/tool';
import { ToolTest } from '../tools/tool-test';

export class Button {
    name: string;
    icon: string;
    tool: Tool;
}

export const BUTTONS: Button[] = [
    { name: 'Crayon', icon: 'create', tool: new InputLogger() },
    { name: 'Pinceau', icon: 'brush', tool: new ToolTest() }
];
