import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

const dialogConfigs = new Map<string, MatDialogConfig>([
    ['NewDrawingComponent', { width: '325px', height: 'auto' } as MatDialogConfig],
    ['ExportDrawingComponent', { width: '920px', height: 'auto' } as MatDialogConfig],
    ['SaveDrawingComponent', { width: '920px', height: 'auto' } as MatDialogConfig],
    ['GalleryComponent', { width: '1920px', height: 'auto' } as MatDialogConfig],
    ['SettingsComponent', { width: '325px', height: 'auto' } as MatDialogConfig],
    ['GuideComponent', { width: '1550px', height: '100%' } as MatDialogConfig],
]);

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private dialog: MatDialog) {}

    openDialog<T>(component: Type<T>): void {
        if (this.isModalPresent) {
            return;
        }

        const config = dialogConfigs.get(component.name);
        this.dialog.open(component, {
            width: config?.width,
            height: config?.height,
            maxWidth: '90vw',
            maxHeight: '95vh',
            panelClass: 'theme-dialog',
        });
    }

    get isModalPresent(): boolean {
        return this.dialog.openDialogs.length > 0;
    }
}
