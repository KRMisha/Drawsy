import { Injectable } from '@angular/core';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Rect } from '@app/shared/classes/rect';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService {
    isMovingSelectionWithArrows = false;
    isMovingSelectionWithMouse = false;

    private selectedElementsChangedSource = new Subject<SVGGraphicsElement[]>();
    private _selectedElements: SVGGraphicsElement[] = []; // tslint:disable-line: variable-name

    private _selectionRect?: Rect; // tslint:disable-line: variable-name

    selectedElementsChanged$ = this.selectedElementsChangedSource.asObservable(); // tslint:disable-line: member-ordering

    constructor(private svgUtilityService: SvgUtilityService) {}

    updateSelectionRect(): void {
        this._selectionRect = this.svgUtilityService.getElementListBounds(this.selectedElements);
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
