import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GuideNode } from '@app/guide/classes/guide-node';
import { guideData } from '@app/guide/constants/guide-data';
import { GuideService } from '@app/guide/services/guide.service';

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent {
    treeControl = new NestedTreeControl<GuideNode>((node: GuideNode) => node.children);
    dataSource = new MatTreeNestedDataSource<GuideNode>();

    constructor(private guideService: GuideService) {
        this.dataSource.data = guideData;
    }

    hasChild = (_: number, node: GuideNode) => node.children !== undefined && node.children.length > 0;

    expandAllMenus(): void {
        this.expandLayer(this.dataSource.data);
    }

    get currentGuideNode(): GuideNode {
        return this.guideService.currentGuideNode;
    }

    set currentGuideNode(guideNode: GuideNode) {
        this.guideService.currentGuideNode = guideNode;
    }

    private expandLayer(nodes: GuideNode[]): void {
        for (const node of nodes) {
            if (node.children !== undefined) {
                this.expandLayer(node.children);
                this.treeControl.expand(node);
            }
        }
    }
}
