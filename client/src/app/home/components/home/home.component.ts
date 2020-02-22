import { Component } from '@angular/core';
import { DrawingService } from '../../../drawing/services/drawing.service';
import { GuideComponent } from '../../../guide/components/guide/guide.component';
import { NewDrawingComponent } from '../../../modals/components/new-drawing/new-drawing.component';
import { ModalService } from '../../../modals/services/modal.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(public drawingService: DrawingService, private modalService: ModalService) {}

    openNewDrawingModal(): void {
        this.modalService.openDialog(NewDrawingComponent);
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }
}
