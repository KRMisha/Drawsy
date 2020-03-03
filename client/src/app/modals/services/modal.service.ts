import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    // Type<any> to prevent all dialogs needing to inherit from a parent component
    // tslint:disable-next-line: no-any
    private dialogRef: MatDialogRef<Type<any>>;

    private _isModalPresent = false; // tslint:disable-line: variable-name
    get isModalPresent(): boolean {
        return this._isModalPresent;
    }

    constructor(private dialog: MatDialog) {}

    // tslint:disable-next-line: no-any
    openDialog(component: Type<any>, dimensions: Vec2): void {
        if (this.isModalPresent) {
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
