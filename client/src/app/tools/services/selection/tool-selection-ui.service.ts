import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { Subscription } from 'rxjs';

const controlPointSideSize = 8;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionUiService implements OnDestroy {
    private renderer: Renderer2;

    private svgUserSelectionRect: SVGRectElement;
    private svgSelectedElementsRectGroup: SVGGElement;
    private svgSelectedElementsRect: SVGRectElement;
    private svgControlPoints: SVGGraphicsElement[] = [];

    private isSelectionDisplayed = false;

    private selectedElementsChangedSubscription: Subscription;
    private selectedElementsRectChangedSubscription: Subscription;

    constructor(
        rendererFactory: RendererFactory2,
        private drawingService: DrawingService,
        private toolSelectionStateService: ToolSelectionStateService
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);

        this.selectedElementsRectChangedSubscription = this.toolSelectionStateService.selectedElementsRectChanged$.subscribe(
            (rect: Rect | undefined) => {
                this.setSelectedElementsRect(rect);
            }
        );

        this.createUiElements();
    }

    ngOnDestroy(): void {
        this.selectedElementsChangedSubscription.unsubscribe();
        this.selectedElementsRectChangedSubscription.unsubscribe();
    }

    setUserSelectionRect(rect: Rect): void {
        this.updateSvgRectFromRect(this.svgUserSelectionRect, rect);
    }

    showUserSelectionRect(): void {
        this.drawingService.addUiElement(this.svgUserSelectionRect);
    }

    hideUserSelectionRect(): void {
        this.drawingService.removeUiElement(this.svgUserSelectionRect);
    }

    updateUserSelectionRectCursor(state: SelectionState): void {
        if (state === SelectionState.MovingSelectionWithMouse) {
            this.renderer.setStyle(this.drawingService.drawingRoot, 'cursor', 'move');
        } else {
            this.resetUserSelectionRectCursor();
        }
    }

    resetUserSelectionRectCursor(): void {
        this.renderer.removeStyle(this.drawingService.drawingRoot, 'cursor');
    }

    private createUiElements(): void {
        // Disable magic numbers false positive lint error for values in static named constructor
        const selectionColor = Color.fromRgb(49, 104, 142); // tslint:disable-line: no-magic-numbers
        const borderColorAlpha = 0.2;
        selectionColor.alpha = borderColorAlpha;
        this.svgUserSelectionRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'fill', selectionColor.toRgbaString());
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-dasharray', '5, 3');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-width', '1.5');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-linecap', 'round');
        const fillColorAlpha = 0.8;
        selectionColor.alpha = fillColorAlpha;
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke', selectionColor.toRgbaString());

        this.svgSelectedElementsRectGroup = this.renderer.createElement('g', 'svg');

        // Disable magic numbers false positive lint error for values in static named constructor
        const selectedElementsRectColor = Color.fromRgb(64, 64, 64); // tslint:disable-line: no-magic-numbers
        this.svgSelectedElementsRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'stroke', selectedElementsRectColor.toRgbString());
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'stroke-width', '1.5');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'fill', 'none');
        this.renderer.appendChild(this.svgSelectedElementsRectGroup, this.svgSelectedElementsRect);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[i], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'fill', selectedElementsRectColor.toRgbString());
            this.renderer.appendChild(this.svgSelectedElementsRectGroup, this.svgControlPoints[i]);
        }
    }

    private setSelectedElementsRect(rect: Rect | undefined): void {
        if (rect === undefined) {
            this.hideSelectedElementsRect();
            return;
        }

        this.updateSvgRectFromRect(this.svgSelectedElementsRect, rect);

        const controlPointPositions: Vec2[] = [
            { x: rect.x, y: rect.y + rect.height / 2 },
            { x: rect.x + rect.width / 2, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
            { x: rect.x + rect.width / 2, y: rect.y + rect.height },
        ];
        for (let i = 0; i < controlPointPositions.length; i++) {
            this.renderer.setAttribute(this.svgControlPoints[i], 'x', `${controlPointPositions[i].x - controlPointSideSize / 2}`);
            this.renderer.setAttribute(this.svgControlPoints[i], 'y', `${controlPointPositions[i].y - controlPointSideSize / 2}`);
        }
        this.showSelectedElementsRect();
    }

    private showSelectedElementsRect(): void {
        if (this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = true;
        this.drawingService.addUiElement(this.svgSelectedElementsRectGroup);
    }

    private hideSelectedElementsRect(): void {
        if (!this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = false;
        this.drawingService.removeUiElement(this.svgSelectedElementsRectGroup);
    }

    private updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }
}
