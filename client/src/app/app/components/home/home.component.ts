import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ThemeSettingsComponent } from '@app/modals/components/settings/theme-settings/theme-settings.component';
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
        this.modalService.openDialog(NewDrawingComponent);
    }

    openGalleryModal(): void {
        this.modalService.openDialog(GalleryComponent);
    }

    openGuideModal(): void {
        this.modalService.openDialog(GuideComponent);
    }

    openThemeSettingsModal(): void {
        this.modalService.openDialog(ThemeSettingsComponent);
    }

    get isDrawingStarted(): boolean {
        return this.drawingService.isDrawingStarted();
    }

    get drawings(): string[] {
        return drawings.concat(drawings).concat(drawings).concat(drawings);
    }
}
