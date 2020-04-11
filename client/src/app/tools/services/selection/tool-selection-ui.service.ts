import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { Subscription } from 'rxjs';

const controlPointRadius = 3;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionUiService implements OnDestroy {
    private renderer: Renderer2;

    private svgUserSelectionRect: SVGRectElement;
    private svgSelectedElementsRectGroup: SVGGElement;
    private svgSelectedElementsRect: SVGRectElement;
    private svgControlPoints: SVGGraphicsElement[] = [];

    private isSelectedElementsRectDisplayed = false;

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
        this.svgUserSelectionRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-dasharray', '5, 3');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-width', '1');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-linecap', 'round');
        this.renderer.addClass(this.svgUserSelectionRect, 'theme-user-selection-rect');

        this.svgSelectedElementsRectGroup = this.renderer.createElement('g', 'svg');

        this.svgSelectedElementsRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'fill', 'none');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'stroke-width', '1.5');
        this.renderer.addClass(this.svgSelectedElementsRect, 'theme-selected-elements-rect');
        this.renderer.appendChild(this.svgSelectedElementsRectGroup, this.svgSelectedElementsRect);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('circle', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[i], 'r', controlPointRadius.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'fill', 'rgb(255, 255, 255)');
            this.renderer.setAttribute(this.svgControlPoints[i], 'stroke-width', '1.25');
            this.renderer.addClass(this.svgControlPoints[i], 'theme-selected-elements-rect');
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
            this.renderer.setAttribute(this.svgControlPoints[i], 'cx', controlPointPositions[i].x.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'cy', controlPointPositions[i].y.toString());
        }
        this.showSelectedElementsRect();
    }

    private showSelectedElementsRect(): void {
        if (this.isSelectedElementsRectDisplayed) {
            return;
        }
        this.isSelectedElementsRectDisplayed = true;
        this.drawingService.addUiElement(this.svgSelectedElementsRectGroup);
    }

    private hideSelectedElementsRect(): void {
        if (!this.isSelectedElementsRectDisplayed) {
            return;
        }
        this.isSelectedElementsRectDisplayed = false;
        this.drawingService.removeUiElement(this.svgSelectedElementsRectGroup);
    }

    private updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }
}
