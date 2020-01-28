import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-guide-sidebar',
    templateUrl: './guide-sidebar.component.html',
    styleUrls: ['./guide-sidebar.component.scss'],
})
export class GuideSidebarComponent {
    @Output() selectGuide = new EventEmitter<number>();
}
