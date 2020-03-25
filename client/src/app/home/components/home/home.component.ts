import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ModalService } from '@app/modals/services/modal.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(private drawingService: DrawingService, private modalService: ModalService) {}

    openNewDrawingModal(): void {
        this.modalService.openNewDrawingModal();
    }

    openGalleryModal(): void {
        this.modalService.openGalleryModal();
    }

    openGuideModal(): void {
        this.modalService.openGuideModal();
    }

    get isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }
}
