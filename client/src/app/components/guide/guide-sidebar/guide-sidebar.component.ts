import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GuideService } from '../../../services/guide/guide.service';

enum CollapseMenuButtons {
    tools,
    toolBrushes,
    toolShapes,
    drawingSurfaceOptions,
    fileOptions,
}

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent implements OnInit, OnDestroy {
    menus = CollapseMenuButtons;
    private subscription: Subscription;
    private isOpenedCollapseMenu: boolean[];

    @Output() selectGuide = new EventEmitter<number>();

    constructor(private guideService: GuideService) {
        this.isOpenedCollapseMenu = [false, false, false, false, false];
    }

    ngOnInit() {
        this.subscription = this.guideService.openAllCollapseMenus().subscribe(shouldOpenAllMenus => {
            if (shouldOpenAllMenus) {
                this.openAllCollapseMenus();
            }
        });
    }

    toggleCollapseMenu(index: number): void {
        this.isOpenedCollapseMenu[index] = !this.isOpenedCollapseMenu[index];
    }

    openAllCollapseMenus(): void {
        for (let i = 0; i < this.isOpenedCollapseMenu.length; i++) {
            this.isOpenedCollapseMenu[i] = true;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
