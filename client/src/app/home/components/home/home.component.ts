import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
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
        this.modalService.openDialog(NewDrawingComponent, { x: 500, y: 500 });
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }

    isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }
}
