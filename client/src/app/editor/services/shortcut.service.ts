import { Injectable } from '@angular/core';
import { ModalService } from '@app/modals/services/modal.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutService {
    areShortcutsEnabled = true;

    private selectToolPencilShortcutSource = new Subject<void>();
    private selectToolPaintbrushShortcutSource = new Subject<void>();
    private selectToolLineShortcutSource = new Subject<void>();
    private selectToolSprayCanShortcutSource = new Subject<void>();
    private selectToolRectangleShortcutSource = new Subject<void>();
    private selectToolEllipseShortcutSource = new Subject<void>();
    private selectToolPolygonShortcutSource = new Subject<void>();
    private selectToolEyedropperShortcutSource = new Subject<void>();
    private selectToolRecolorShortcutSource = new Subject<void>();
    private selectToolSelectionShortcutSource = new Subject<void>();
    private selectToolEraserShortcutSource = new Subject<void>();
    private openNewDrawingShortcutSource = new Subject<void>();
    private openExportDrawingShortcutSource = new Subject<void>();
    private openSaveDrawingShortcutSource = new Subject<void>();
    private openGalleryShortcutSource = new Subject<void>();
    private undoShortcutSource = new Subject<void>();
    private redoShortcutSource = new Subject<void>();
    private toggleGridSource = new Subject<void>();
    private increaseGridSizeSource = new Subject<void>();
    private decreaseGridSizeSource = new Subject<void>();

    // tslint:disable: member-ordering
    selectToolPencilShortcut$ = this.selectToolPencilShortcutSource.asObservable();
    selectToolPaintbrushShortcut$ = this.selectToolPaintbrushShortcutSource.asObservable();
    selectToolLineShortcut$ = this.selectToolLineShortcutSource.asObservable();
    selectToolSprayCanShortcut$ = this.selectToolSprayCanShortcutSource.asObservable();
    selectToolRectangleShortcut$ = this.selectToolRectangleShortcutSource.asObservable();
    selectToolEllipseShortcut$ = this.selectToolEllipseShortcutSource.asObservable();
    selectToolPolygonShortcut$ = this.selectToolPolygonShortcutSource.asObservable();
    selectToolEyedropperShortcut$ = this.selectToolEyedropperShortcutSource.asObservable();
    selectToolRecolorShortcut$ = this.selectToolRecolorShortcutSource.asObservable();
    selectToolSelectionShortcut$ = this.selectToolSelectionShortcutSource.asObservable();
    selectToolEraserShortcut$ = this.selectToolEraserShortcutSource.asObservable();
    openNewDrawingShortcut$ = this.openNewDrawingShortcutSource.asObservable();
    openExportDrawingShortcut$ = this.openExportDrawingShortcutSource.asObservable();
    openSaveDrawingShortcut$ = this.openSaveDrawingShortcutSource.asObservable();
    openGalleryShortcut$ = this.openGalleryShortcutSource.asObservable();
    undoShortcut$ = this.undoShortcutSource.asObservable();
    redoShortcut$ = this.redoShortcutSource.asObservable();
    toggleGrid$ = this.toggleGridSource.asObservable();
    increaseGridSize$ = this.increaseGridSizeSource.asObservable();
    decreaseGridSize$ = this.decreaseGridSizeSource.asObservable();
    // tslint:enable: member-ordering

    constructor(private modalService: ModalService) {}

    // Switch statement represents a specialized lookup table to centralize and dispatch shortcut events
    // tslint:disable-next-line: cyclomatic-complexity
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
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
                    if (!event.ctrlKey) {
                        this.selectToolSprayCanShortcutSource.next();
                    }
                    break;
                case 'c':
                    if (!event.ctrlKey) {
                        this.selectToolPencilShortcutSource.next();
                    }
                    break;
                case 'e':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.openExportDrawingShortcutSource.next();
                    } else {
                        this.selectToolEraserShortcutSource.next();
                    }
                    break;
                case 'g':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.openGalleryShortcutSource.next();
                    } else {
                        this.toggleGridSource.next();
                    }
                    break;
                case 'i':
                    this.selectToolEyedropperShortcutSource.next();
                    break;
                case 'l':
                    this.selectToolLineShortcutSource.next();
                    break;
                case 'o':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.openNewDrawingShortcutSource.next();
                    }
                case 'r':
                    this.selectToolRecolorShortcutSource.next();
                    break;
                case 's':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.openSaveDrawingShortcutSource.next();
                    } else {
                        this.selectToolSelectionShortcutSource.next();
                    }
                    break;
                case 'w':
                    this.selectToolPaintbrushShortcutSource.next();
                    break;
                case 'z':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.undoShortcutSource.next();
                    }
                    break;
                case 'Z':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.redoShortcutSource.next();
                    }
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
}
