import { Injectable, OnDestroy } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService implements OnDestroy {
    state = SelectionState.None;

    private _selectedElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name
    private _selectedElementsRect?: Rect; // tslint:disable-line: variable-name

    private selectedElementsChangedSubscription: Subscription;

    private selectedElementsRectChangedSource = new Subject<Rect | undefined>();

    // Disable member ordering lint error for public observables initialized after private subjects
    selectedElementsRectChanged$ = this.selectedElementsRectChangedSource.asObservable(); // tslint:disable-line: member-ordering
    // Disable member ordering lint error for order consistency between observables
    selectedElementsChanged$ = new Subject<SVGGraphicsElement[]>(); // tslint:disable-line: member-ordering

    constructor(private toolSelectionCollisionService: ToolSelectionCollisionService) {
        this.selectedElementsChangedSubscription = this.selectedElementsChanged$.subscribe((elements: SVGGraphicsElement[]) => {
            this.selectedElementsRect = this.toolSelectionCollisionService.getElementListBounds(elements);
        });
    }

    ngOnDestroy(): void {
        this.selectedElementsChangedSubscription.unsubscribe();
    }

    get selectedElements(): SVGGraphicsElement[] {
        return this._selectedElements;
    }

    set selectedElements(selectedElements: SVGGraphicsElement[]) {
        this._selectedElements = selectedElements;
        this.selectedElementsChanged$.next(selectedElements);
    }

    get selectedElementsRect(): Rect | undefined {
        return this._selectedElementsRect;
    }

    set selectedElementsRect(rect: Rect | undefined) {
        this._selectedElementsRect = rect;
        this.selectedElementsRectChangedSource.next(this._selectedElementsRect);
    }
}
