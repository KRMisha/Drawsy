import { Component, HostListener } from '@angular/core';
import { ModalService } from 'src/app/modals/services/modal.service';
import { CreateDrawingComponent } from '../modals/create-drawing/create-drawing.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private modalService: ModalService) {}

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.modalService.openDialog(CreateDrawingComponent);
        }
    }
}
