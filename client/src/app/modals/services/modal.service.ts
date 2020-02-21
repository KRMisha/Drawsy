import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from 'src/app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private dialogRef: MatDialogRef<Type<any>>;

    private _isModalPresent = false; // tslint:disable-line: variable-name
    get isModalPresent(): boolean {
        return this._isModalPresent;
    }

    constructor(private dialog: MatDialog) {}

    openDialog(component: Type<any>, dimensions?: Vec2): void {
        if (this.isModalPresent) {
            return;
        }

        this.dialogRef = this.dialog.open(
            component,
            (dimensions && {
                width: `${dimensions.x}px`,
                height: `${dimensions.y}px`,
            }) ||
                {},
        );
        this.dialogRef.afterClosed().subscribe(() => {
            this._isModalPresent = false;
        });
        this._isModalPresent = true;
    }
}
