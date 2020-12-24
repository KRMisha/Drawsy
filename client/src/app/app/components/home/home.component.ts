import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(private drawingService: DrawingService, private modalService: ModalService) {}

    openNewDrawingModal(): void {
        this.modalService.openDialog(NewDrawingComponent);
    }

    openGalleryModal(): void {
        this.modalService.openDialog(GalleryComponent);
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent);
    }

    get isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }
}
