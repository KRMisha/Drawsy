import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output, Type } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { guideData, GuideNode } from '@app/guide/classes/guide-node/guide-node';

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

    treeControl = new NestedTreeControl<GuideNode>((node: GuideNode) => node.children);
    dataSource = new MatTreeNestedDataSource<GuideNode>();

    @Output() selectGuide = new EventEmitter<Type<any>>(); // tslint:disable-line: no-any

    constructor() {
        this.dataSource.data = guideData;
    }

    hasChild = (_: number, node: GuideNode) => !!node.children && node.children.length > 0;

    expandLayer(nodes: GuideNode[]): void {
        for (const node of nodes) {
            if (node.children) {
                this.expandLayer(node.children);
                this.treeControl.expand(node);
            }
        }
    }

    expandAllMenus(): void {
        this.expandLayer(this.dataSource.data);
    }
}
