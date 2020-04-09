import { Injectable } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService {
    state = SelectionState.None;

    private _selectedElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name
    private _selectedElementsRect?: Rect; // tslint:disable-line: variable-name

    private selectedElementsRectChangedSource = new Subject<Rect | undefined>();

    // Disable member ordering lint error for public observables initialized after private subjects
    selectedElementsRectChanged$ = this.selectedElementsRectChangedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(private toolSelectionCollisionService: ToolSelectionCollisionService) {}

    get selectedElements(): SVGGraphicsElement[] {
        return this._selectedElements;
    }

    set selectedElements(selectedElements: SVGGraphicsElement[]) {
        this._selectedElements = selectedElements;
        this._selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(this.selectedElements);
        this.selectedElementsRectChangedSource.next(this._selectedElementsRect);
    }

    get selectedElementsRect(): Rect | undefined {
        return this._selectedElementsRect;
    }

    set selectedElementsRect(rect: Rect | undefined) {
        this._selectedElementsRect = rect;
        this.selectedElementsRectChangedSource.next(this._selectedElementsRect);
    }
}
