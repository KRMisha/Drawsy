import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ModalService } from '@app/modals/services/modal.service';

const drawings = [
    '/assets/home-drawings/birdie.jpeg',
    '/assets/home-drawings/boat.jpeg',
    '/assets/home-drawings/george.jpeg',
    '/assets/home-drawings/quebec-solidaire.jpeg',
];

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

    openLightSettingsModal(): void {
        this.modalService.openLightSettingsModal();
    }

    get isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }

    get drawings(): string[] {
        return drawings.concat(drawings).concat(drawings).concat(drawings);
    }
}
