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
    private isMenuExpanded: boolean[];

    @Output() selectGuide = new EventEmitter<number>();

    constructor(private guideService: GuideService) {
        this.isMenuExpanded = [false, false, false, false, false];
    }

    ngOnInit() {
        this.subscription = this.guideService.openAllCollapseMenus().subscribe((shouldOpenAllMenus) => {
            if (shouldOpenAllMenus) {
                this.openAllCollapseMenus();
            }
        });
    }

    toggleCollapseMenu(index: number): void {
        this.isMenuExpanded[index] = !this.isMenuExpanded[index];
    }

    openAllCollapseMenus(): void {
        for (let i = 0; i < this.isMenuExpanded.length; i++) {
            this.isMenuExpanded[i] = true;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
