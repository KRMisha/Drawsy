import { Injectable } from '@angular/core';
import { ModalService } from '@app/modals/services/modal.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutService {
    areShortcutsEnabled = true;
    pressedKeys = new Set<string>();

    private selectToolPencilShortcutSource = new Subject<void>();
    private selectToolPaintbrushShortcutSource = new Subject<void>();
    private selectToolLineShortcutSource = new Subject<void>();
    private selectToolSprayCanShortcutSource = new Subject<void>();
    private selectToolRectangleShortcutSource = new Subject<void>();
    private selectToolEllipseShortcutSource = new Subject<void>();
    private selectToolPolygonShortcutSource = new Subject<void>();
    private selectToolFillShortcutSource = new Subject<void>();
    private selectToolEyedropperShortcutSource = new Subject<void>();
    private selectToolRecolorShortcutSource = new Subject<void>();
    private selectToolSelectionShortcutSource = new Subject<void>();
    private selectToolEraserShortcutSource = new Subject<void>();
    private openNewDrawingShortcutSource = new Subject<void>();
    private openExportDrawingShortcutSource = new Subject<void>();
    private openSaveDrawingShortcutSource = new Subject<void>();
    private openGalleryShortcutSource = new Subject<void>();
    private selectAllShortcutSource = new Subject<void>();
    private copySelectionShortcutSource = new Subject<void>();
    private pasteSelectionShortcutSource = new Subject<void>();
    private cutSelectionShortcutSource = new Subject<void>();
    private duplicateSelectionShortcutSource = new Subject<void>();
    private undoShortcutSource = new Subject<void>();
    private redoShortcutSource = new Subject<void>();
    private toggleGridSource = new Subject<void>();
    private increaseGridSizeSource = new Subject<void>();
    private decreaseGridSizeSource = new Subject<void>();
    private toggleSudoModeSource = new Subject<void>();

    // Disable member ordering lint error for public observables initialized after private subjects
    // tslint:disable: member-ordering
    selectToolPencilShortcut$ = this.selectToolPencilShortcutSource.asObservable();
    selectToolPaintbrushShortcut$ = this.selectToolPaintbrushShortcutSource.asObservable();
    selectToolLineShortcut$ = this.selectToolLineShortcutSource.asObservable();
    selectToolSprayCanShortcut$ = this.selectToolSprayCanShortcutSource.asObservable();
    selectToolRectangleShortcut$ = this.selectToolRectangleShortcutSource.asObservable();
    selectToolEllipseShortcut$ = this.selectToolEllipseShortcutSource.asObservable();
    selectToolPolygonShortcut$ = this.selectToolPolygonShortcutSource.asObservable();
    selectToolFillShortcut$ = this.selectToolFillShortcutSource.asObservable();
    selectToolEyedropperShortcut$ = this.selectToolEyedropperShortcutSource.asObservable();
    selectToolRecolorShortcut$ = this.selectToolRecolorShortcutSource.asObservable();
    selectToolSelectionShortcut$ = this.selectToolSelectionShortcutSource.asObservable();
    selectToolEraserShortcut$ = this.selectToolEraserShortcutSource.asObservable();
    openNewDrawingShortcut$ = this.openNewDrawingShortcutSource.asObservable();
    openExportDrawingShortcut$ = this.openExportDrawingShortcutSource.asObservable();
    openSaveDrawingShortcut$ = this.openSaveDrawingShortcutSource.asObservable();
    openGalleryShortcut$ = this.openGalleryShortcutSource.asObservable();
    selectAllShortcut$ = this.selectAllShortcutSource.asObservable();
    copySelectionShortcut$ = this.copySelectionShortcutSource.asObservable();
    pasteSelectionShortcut$ = this.pasteSelectionShortcutSource.asObservable();
    cutSelectionShortcut$ = this.cutSelectionShortcutSource.asObservable();
    duplicateSelectionShortcut$ = this.duplicateSelectionShortcutSource.asObservable();
    undoShortcut$ = this.undoShortcutSource.asObservable();
    redoShortcut$ = this.redoShortcutSource.asObservable();
    toggleGrid$ = this.toggleGridSource.asObservable();
    increaseGridSize$ = this.increaseGridSizeSource.asObservable();
    decreaseGridSize$ = this.decreaseGridSizeSource.asObservable();
    toggleSudoMode$ = this.toggleSudoModeSource.asObservable();
    // tslint:enable: member-ordering

    constructor(private modalService: ModalService) {}

    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            if (event.ctrlKey) {
                this.handleCtrlShortcuts(event);
            } else {
                this.handleNonCtrlShortcuts(event);
            }

            this.pressedKeys.add(event.key);

            const sudoModeKeys = ['d', 'r', 'a', 'w', 's', 'y'];
            const isSudoModePatternPressed =
                this.pressedKeys.size === sudoModeKeys.length && sudoModeKeys.every((key: string) => this.pressedKeys.has(key));
            if (!event.repeat && isSudoModePatternPressed) {
                this.toggleSudoModeSource.next();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            this.pressedKeys.delete(event.key);
        }
    }

    private handleCtrlShortcuts(event: KeyboardEvent): void {
        switch (event.key) {
            case 'a':
            case 'A':
                event.preventDefault();
                this.selectAllShortcutSource.next();
                break;
            case 'c':
            case 'C':
                event.preventDefault();
                this.copySelectionShortcutSource.next();
                break;
            case 'd':
            case 'D':
                event.preventDefault();
                this.duplicateSelectionShortcutSource.next();
                break;
            case 'e':
            case 'E':
                event.preventDefault();
                this.openExportDrawingShortcutSource.next();
                break;
            case 'g':
            case 'G':
                event.preventDefault();
                this.openGalleryShortcutSource.next();
                break;
            case 'o':
            case 'O':
                event.preventDefault();
                this.openNewDrawingShortcutSource.next();
                break;
            case 's':
            case 'S':
                event.preventDefault();
                this.openSaveDrawingShortcutSource.next();
                break;
            case 'v':
            case 'V':
                event.preventDefault();
                this.pasteSelectionShortcutSource.next();
                break;
            case 'x':
            case 'X':
                event.preventDefault();
                this.cutSelectionShortcutSource.next();
                break;
            case 'z':
            case 'Z':
                event.preventDefault();
                event.shiftKey ? this.redoShortcutSource.next() : this.undoShortcutSource.next();
                break;
        }
    }

    // Disable cyclomatic complexity lint error because the switch statement acts as a specialized lookup map
    // tslint:disable-next-line: cyclomatic-complexity
    private handleNonCtrlShortcuts(event: KeyboardEvent): void {
        switch (event.key) {
            case '1':
                this.selectToolRectangleShortcutSource.next();
                break;
            case '2':
                this.selectToolEllipseShortcutSource.next();
                break;
            case '3':
                this.selectToolPolygonShortcutSource.next();
                break;
            case 'a':
            case 'A':
                this.selectToolSprayCanShortcutSource.next();
                break;
            case 'b':
            case 'B':
                this.selectToolFillShortcutSource.next();
                break;
            case 'c':
            case 'C':
                this.selectToolPencilShortcutSource.next();
                break;
            case 'e':
            case 'E':
                this.selectToolEraserShortcutSource.next();
                break;
            case 'g':
            case 'G':
                this.toggleGridSource.next();
                break;
            case 'i':
            case 'I':
                this.selectToolEyedropperShortcutSource.next();
                break;
            case 'l':
            case 'L':
                this.selectToolLineShortcutSource.next();
                break;
            case 'r':
            case 'R':
                this.selectToolRecolorShortcutSource.next();
                break;
            case 's':
            case 'S':
                this.selectToolSelectionShortcutSource.next();
                break;
            case 'w':
            case 'W':
                this.selectToolPaintbrushShortcutSource.next();
                break;
            case '+':
                this.increaseGridSizeSource.next();
                break;
            case '-':
                this.decreaseGridSizeSource.next();
                break;
        }
    }
}
