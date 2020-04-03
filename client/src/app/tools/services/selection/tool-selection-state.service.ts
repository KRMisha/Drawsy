import { Injectable } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';
import { Subject } from 'rxjs';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService {
    isMovingSelectionWithArrows = false;
    isMovingSelectionWithMouse = false;

    private _selectedElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name
    private _selectionRect?: Rect; // tslint:disable-line: variable-name

    private selectedElementsChangedSource = new Subject<SVGGraphicsElement[]>();

    // Disable member ordering lint error for public observables initialized after private subjects
    selectedElementsChanged$ = this.selectedElementsChangedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(private toolSelectionCollisionService: ToolSelectionCollisionService) {}

    updateSelectionRect(): void {
        this._selectionRect = this.toolSelectionCollisionService.getElementListBounds(this.selectedElements);
    }

    get selectedElements(): SVGGraphicsElement[] {
        return this._selectedElements;
    }

    set selectedElements(selectedElements: SVGGraphicsElement[]) {
        this._selectedElements = selectedElements;
        this.updateSelectionRect();
        this.selectedElementsChangedSource.next(selectedElements);
    }

    get selectionRect(): Rect | undefined {
        return this._selectionRect;
    }
}
