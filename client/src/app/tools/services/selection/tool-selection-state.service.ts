import { Injectable } from '@angular/core';
import { Rect } from '@app/classes/rect';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService {
    selectedElements: SVGElement[] = [];
    svgSelectedShapesRect: SVGRectElement;
    svgUserSelectionRect: SVGRectElement;
    svgControlPoints: SVGElement[] = [];
    selectionRect?: Rect = undefined;

    isMovingSelectionWithArrows = false;
    isMovingSelectionWithMouse = false;
}
