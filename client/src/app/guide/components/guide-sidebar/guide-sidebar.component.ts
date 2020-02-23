import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Type } from '@angular/core';

enum MenuSection {
    Tools,
    ToolBrushes,
    ToolShapes,
    DrawingSurfaceOptions,
    FileOptions,
}

interface GuideNode {
  name: string;
  children?: GuideNode[];
  guide?: Type<any>;
}

const GuideData: GuideNode[] = [
  {
    name: 'Bienvenue',
  }, {
    name: 'Outils',
    children: [
      {
        name: 'Outils de traçage',
        children: [
          {name: 'Aérosol'},
          {name: 'Crayon'},
          {name: 'Pinceau'},
          {name: 'Plume'},
        ]
      }, {
        name: 'Formes',
        children: [
          {name: 'Ellipse'},
          {name: 'Polygone'},
          {name: 'Rectangle'},
        ]
      },
      {name: 'Applicateur de couleur'},
      {name: 'Couleur'},
      {name: 'Efface'},
      {name: 'Étampe'},
      {name: 'Ligne'},
      {name: 'Pipette'},
      {name: 'Seau de peinture'},
      {name: 'Texte'},
      {name: 'Sélection'},
    ]
  }, {
    name: 'Surface de dessin',
    children: [
        {name: 'Grille'},
        {name: 'Magnétisme'},
    ]
  }, {
    name: 'Option de fichiers',
    children: [
        {name: 'Exporter le dessin'},
        {name: 'Sauvegarder le dessin'},
    ]
  },
];

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent {
    MenuSection = MenuSection; // Make enum available to template
    isEachMenuExpanded: boolean[] = [false, false, false, false, false];

    treeControl = new NestedTreeControl<GuideNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<GuideNode>();

    @Output() selectGuide = new EventEmitter<number>();

    constructor() {
      this.dataSource.data = GuideData;
    }

    hasChild = (_: number, node: GuideNode) => !!node.children && node.children.length > 0;

    toggleMenu(menuSection: MenuSection): void {
        this.isEachMenuExpanded[menuSection] = !this.isEachMenuExpanded[menuSection];
    }

    expandAllMenus(): void {
        for (let i = 0; i < this.isEachMenuExpanded.length; i++) {
            this.isEachMenuExpanded[i] = true;
        }
    }
}
