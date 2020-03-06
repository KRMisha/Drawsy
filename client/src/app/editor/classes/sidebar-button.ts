import { ToolNames } from '@app/tools/enums/tool-names.enum';

export class SidebarButton {
    name: string;
    icon: string;
    toolIndex: number;
}

export const sidebarButtons: SidebarButton[] = [
    { name: ToolNames.Pencil, icon: 'create', toolIndex: 0 },
    { name: ToolNames.Brush, icon: 'brush', toolIndex: 1 },
    { name: ToolNames.Line, icon: 'timeline', toolIndex: 2 },
    { name: ToolNames.Rectangle, icon: 'crop_5_4', toolIndex: 3 },
    { name: ToolNames.Ellipse, icon: 'panorama_fish_eye', toolIndex: 4 },
    { name: ToolNames.Polygon, icon: 'star', toolIndex: 5 },
    { name: ToolNames.Eyedropper, icon: 'colorize', toolIndex: 6 },
    { name: ToolNames.Selection, icon: 'format_shapes', toolIndex: 7 },
    { name: ToolNames.Eraser, icon: 'delete', toolIndex: 8 },
];
