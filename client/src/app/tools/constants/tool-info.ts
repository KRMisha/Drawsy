import { ToolData } from '@app/tools/classes/tool-data';

export default {
    Pencil: { name: 'Crayon', shortcut: 'C', icon: 'pencil' } as ToolData,
    Paintbrush: { name: 'Pinceau', shortcut: 'W', icon: 'brush' } as ToolData,
    Line: { name: 'Ligne', shortcut: 'L', icon: 'chart-timeline-variant' } as ToolData,
    SprayCan: { name: 'Aérosol', shortcut: 'A', icon: 'spray' } as ToolData,
    Rectangle: { name: 'Rectangle', shortcut: '1', icon: 'crop-square' } as ToolData,
    Ellipse: { name: 'Ellipse', shortcut: '2', icon: 'ellipse-outline' } as ToolData,
    Polygon: { name: 'Polygone', shortcut: '3', icon: 'hexagon-outline' } as ToolData,
    Fill: { name: 'Seau de peinture', shortcut: 'B', icon: 'format-color-fill' } as ToolData,
    Eyedropper: { name: 'Pipette', shortcut: 'I', icon: 'eyedropper-variant' } as ToolData,
    Recolor: { name: 'Applicateur de couleur', shortcut: 'R', icon: 'format-paint' } as ToolData,
    Selection: { name: 'Sélection', shortcut: 'S', icon: 'selection' } as ToolData,
    Eraser: { name: 'Efface', shortcut: 'E', icon: 'eraser' } as ToolData,
};
