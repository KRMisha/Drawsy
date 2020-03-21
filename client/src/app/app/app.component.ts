import { Component, HostListener } from '@angular/core';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';
import { ThemeService } from '@app/theme/services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private modalService: ModalService, private themeService: ThemeService) {}

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.modalService.openDialog(NewDrawingComponent, { x: 500, y: 500 });
        } else if (event.ctrlKey && event.key === 'g') {
            event.preventDefault();
            this.modalService.openDialog(GalleryComponent, { x: 1920, y: 1000 });
        }
    }

    get theme(): string {
        return this.themeService.getTheme();
    }
}
