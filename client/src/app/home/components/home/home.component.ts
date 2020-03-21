import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ModalService } from '@app/modals/services/modal.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(private drawingService: DrawingService, private modalService: ModalService, private router: Router) {}

    openNewDrawingModal(): void {
        this.modalService.openNewDrawingModal();
    }

    openGalleryModal(): void {
        this.modalService.openGalleryModal();
    }

    openGuideModal(): void {
        this.modalService.openGuideModal();
    }

    continueDrawing(): void {
        this.router.navigate(['/editor']);
    }

    get isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }
}
