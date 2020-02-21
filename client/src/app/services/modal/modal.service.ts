import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from 'src/app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private dialogRef: MatDialogRef<Type<any>>;

    private _isModalPresent = false; // tslint:disable-line: variable-name
    get isModalPresent() {
        return this._isModalPresent;
    }

    constructor(private dialog: MatDialog) {}

    openDialog(component: Type<any>, dimensions?: Vec2) {
        if (this.isModalPresent) {
            return;
        }

        if (dimensions === undefined) {
            this.dialogRef = this.dialog.open(component, {});
        } else {
            this.dialogRef = this.dialog.open(component, {
                width: `${dimensions.x}px`,
                height: `${dimensions.y}px`,
            });
        }
        this.dialogRef.afterClosed().subscribe(() => {
            this._isModalPresent = false;
        });
        this._isModalPresent = true;
    }
}
