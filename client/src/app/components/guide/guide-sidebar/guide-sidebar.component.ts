import { Component, EventEmitter, Output } from '@angular/core';

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

    @Output() selectGuide = new EventEmitter<number>();

    toggleMenu(menuSection: MenuSection): void {
        this.isEachMenuExpanded[menuSection] = !this.isEachMenuExpanded[menuSection];
    }

    expandAllMenus(): void {
        for (let i = 0; i < this.isEachMenuExpanded.length; i++) {
            this.isEachMenuExpanded[i] = true;
        }
    }
}
