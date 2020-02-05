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
    { name: 'Pinceau', icon: 'brush', tool: new ToolTest() },
    { name: 'Ligne', icon: 'timeline', tool: new ToolTest() },
    { name: 'Rectangle', icon: 'crop_5_4', tool: new ToolTest() },
    { name: 'Pipette', icon: 'colorize', tool: new ToolTest() },
    { name: 'Remplisseur', icon: 'opacity', tool: new ToolTest() },
    { name: 'Aerosol', icon: 'blur_on', tool: new ToolTest() },
    { name: 'Sam', icon: 'colorize', tool: new ToolTest() },
];
