import { Injectable } from '@angular/core';
import { Rect } from '@app/shared/classes/rect';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionStateService {
    selectedElements: SVGGraphicsElement[] = [];
    svgSelectedShapesRect: SVGRectElement;
    svgUserSelectionRect: SVGRectElement;
    svgControlPoints: SVGGraphicsElement[] = [];
    selectionRect?: Rect = undefined;

    isMovingSelectionWithArrows = false;
    isMovingSelectionWithMouse = false;
}
