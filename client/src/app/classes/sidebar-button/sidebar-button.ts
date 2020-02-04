export class SidebarButton {
    name: string;
    icon: string;
    toolIndex: number;
}

export const sidebarButtons: SidebarButton[] = [
    { name: 'Crayon', icon: 'create', toolIndex: 0 },
    { name: 'Pinceau', icon: 'brush', toolIndex: 1 },
    { name: 'Ligne', icon: 'timeline', toolIndex: 2 },
    { name: 'Rectangle', icon: 'crop_5_4', toolIndex: 3 },
    { name: 'Pipette', icon: 'colorize', toolIndex: 4 },
    { name: 'Remplisseur', icon: 'opacity', toolIndex: 5 },
    { name: 'Aerosol', icon: 'blur_on', toolIndex: 6 },
];
