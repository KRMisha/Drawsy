import { Component, HostListener } from '@angular/core';
import { ModalService } from '@app/modals/services/modal.service';
import { NewDrawingComponent } from '../modals/components/new-drawing/new-drawing.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private modalService: ModalService) {}

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.modalService.openDialog(NewDrawingComponent);
        }
    }
}
