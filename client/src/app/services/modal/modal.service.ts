import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from 'src/app/classes/vec2/vec2';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private dialogRef: MatDialogRef<Type<any>>;
    isModalPresent = false;

    constructor(private dialog: MatDialog) {}

    openDialog(component: Type<any>, dimensions?: Vec2) {
        if (!this.isModalPresent) {
            if (dimensions === undefined) {
                this.dialogRef = this.dialog.open(component, {});
            } else {
                this.dialogRef = this.dialog.open(component, {
                    width: dimensions.x.toString() + 'px',
                    height: dimensions.y.toString() + 'px',
                });
            }
            this.dialogRef.afterClosed().subscribe(() => {
                this.isModalPresent = false;
            });
            this.isModalPresent = true;
        }
    }
}
