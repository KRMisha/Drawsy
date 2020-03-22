import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { DrawingSettingsComponent } from '@app/drawing/components/drawing-settings/drawing-settings.component';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    // Type<any> to prevent all dialogs needing to inherit from a parent component
    private dialogRef: MatDialogRef<Type<any>>; // tslint:disable-line: no-any

    private _isModalPresent = false; // tslint:disable-line: variable-name

    constructor(private dialog: MatDialog) {}

    openNewDrawingModal(): void {
        this.openDialog(NewDrawingComponent, { x: 425, y: 500 });
    }

    openExportDrawingModal(): void {
        this.openDialog(ExportDrawingComponent, { x: 1000, y: 850 });
    }

    openSaveDrawingModal(): void {
        this.openDialog(SaveDrawingComponent, { x: 1000, y: 900 });
    }

    openGalleryModal(): void {
        this.openDialog(GalleryComponent, { x: 1920, y: 900 });
    }

    openDrawingSettingsModal(): void {
        this.openDialog(DrawingSettingsComponent, { x: 425, y: 750 });
    }

    openGuideModal(): void {
        this.openDialog(GuideComponent, { x: 1920, y: 1080 });
    }

    get isModalPresent(): boolean {
        return this._isModalPresent;
    }

    // tslint:disable-next-line: no-any
    private openDialog(component: Type<any>, dimensions: Vec2): void {
        if (this._isModalPresent) {
            return;
        }

        this.dialogRef = this.dialog.open(component, {
            width: `${dimensions.x}px`,
            height: `${dimensions.y}px`,
        });
        this.dialogRef.afterClosed().subscribe(() => {
            this._isModalPresent = false;
        });
        this._isModalPresent = true;
    }
}
