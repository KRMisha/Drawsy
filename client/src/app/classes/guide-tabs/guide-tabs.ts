export class Tab {
    name: string;
    link: string;
}

export const TABS: Tab[] = [
    { name: 'Bienvenue', link: 'welcome-guide' },
    { name: 'Outils', link: 'tool-guide' },
];

export const TOOLS: Tab[] = [
    { name: 'Crayon', link: 'pen-guide' },
    { name: 'Pinceau', link: 'brush-guide' },
    { name: 'Ligne', link: 'line-guide' },
    { name: 'Carré', link: 'square-guide' },
];
