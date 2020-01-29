import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent {
    isOpen: boolean = false;

    @Output() selectGuide = new EventEmitter<number>();

    public toggleCollapseMenu() {
      this.isOpen = !this.isOpen;
    }
}
