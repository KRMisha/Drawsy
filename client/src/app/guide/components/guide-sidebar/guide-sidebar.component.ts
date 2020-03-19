import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GuideContent } from '@app/guide/classes/guide-content';
import { guideData, GuideNode } from '@app/guide/classes/guide-node';

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent {
    treeControl = new NestedTreeControl<GuideNode>((node: GuideNode) => node.children);
    dataSource = new MatTreeNestedDataSource<GuideNode>();

    @Output() selectGuide = new EventEmitter<Type<GuideContent>>();
    @Input() selectedComponentButton: string;

    constructor() {
        this.dataSource.data = guideData;
        this.selectedComponentButton = 'GuideWelcomeComponent';
    }

    hasChild = (_: number, node: GuideNode) => node.children !== undefined && node.children.length > 0;

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

    updateGuideButton(nodeName: string): void {
        this.selectedComponentButton = nodeName;
    }
}
