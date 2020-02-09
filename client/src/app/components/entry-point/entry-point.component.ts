import { Component } from '@angular/core';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ModalService } from '../../services/modal/modal.service';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { GuideComponent } from '../guide/guide.component';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent {
    constructor(public drawingService: DrawingService, private modalService: ModalService) {}

    openCreateDrawing(): void {
        this.modalService.openDialog(CreateDrawingComponent);
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }
}
