import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
import { SettingsComponent } from '@app/modals/components/settings/settings/settings.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private dialog: MatDialog) {}

    openNewDrawingModal(): void {
        const width = 325;
        this.openDialog(NewDrawingComponent, width, false);
    }

    openExportDrawingModal(): void {
        const width = 920;
        this.openDialog(ExportDrawingComponent, width, false);
    }

    openSaveDrawingModal(): void {
        const width = 920;
        this.openDialog(SaveDrawingComponent, width, false);
    }

    openGalleryModal(): void {
        const width = 1920;
        this.openDialog(GalleryComponent, width, false);
    }

    openSettingsModal(): void {
        const width = 325;
        this.openDialog(SettingsComponent, width, false);
    }

    openGuideModal(): void {
        const width = 1920;
        this.openDialog(GuideComponent, width, true);
    }

    get isModalPresent(): boolean {
        return this.dialog.openDialogs.length > 0;
    }

    private openDialog<T>(component: Type<T>, width: number, shouldFillHeight: boolean): void {
        if (this.isModalPresent) {
            return;
        }

        this.dialog.open(component, {
            width: `${width}px`,
            height: shouldFillHeight ? '100%' : 'auto',
            maxWidth: '90vw',
            maxHeight: '95vh',
            panelClass: 'theme-dialog',
        });
    }
}
