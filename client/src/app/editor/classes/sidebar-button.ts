import { ToolName } from '@app/tools/enums/tool-name.enum';

export class SidebarButton {
    name: string;
    icon: string;
    toolIndex: number;
}

export const sidebarButtons: SidebarButton[] = [
    { name: ToolName.Pencil, icon: 'create', toolIndex: 0 },
    { name: ToolName.Brush, icon: 'brush', toolIndex: 1 },
    { name: ToolName.Line, icon: 'timeline', toolIndex: 2 },
    { name: ToolName.SprayCan, icon: 'flare', toolIndex: 3 },
    { name: ToolName.Rectangle, icon: 'crop_5_4', toolIndex: 4 },
    { name: ToolName.Ellipse, icon: 'panorama_fish_eye', toolIndex: 5 },
    { name: ToolName.Polygon, icon: 'star', toolIndex: 6 },
    { name: ToolName.Eyedropper, icon: 'colorize', toolIndex: 7 },
    { name: ToolName.Recolor, icon: 'format_paint', toolIndex: 8 },
    { name: ToolName.Selection, icon: 'select_all', toolIndex: 9 },
    { name: ToolName.Eraser, icon: 'delete_sweep', toolIndex: 10 },
];
