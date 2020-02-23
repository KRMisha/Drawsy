import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GuideData, GuideNode } from '@app/guide/classes/guide-node/guide-node'

enum MenuSection {
    Tools,
    ToolBrushes,
    ToolShapes,
    DrawingSurfaceOptions,
    FileOptions,
}

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
