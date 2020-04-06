import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { Subscription } from 'rxjs';

const controlPointSideSize = 8;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionUiService implements OnDestroy {
    private renderer: Renderer2;

    private svgUserSelectionRect: SVGRectElement;
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

    private createUiElements(): void {
        // Disable magic numbers false positive lint error for values in static named constructor
        const borderColor = Color.fromRgb(49, 104, 142); // tslint:disable-line: no-magic-numbers
        this.svgUserSelectionRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'fill', `rgba(${borderColor.red}, ${borderColor.green}, ${borderColor.blue}, 0.2)`);
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-dasharray', '5, 3');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-width', '2');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svgUserSelectionRect, 'stroke', `rgba(${borderColor.red}, ${borderColor.green}, ${borderColor.blue}, 0.8)`);

        // Disable magic numbers false positive lint error for values in static named constructor
        const selectedElementsRectColor = Color.fromRgb(64, 64, 64); // tslint:disable-line: no-magic-numbers
        this.svgSelectedElementsRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'stroke', selectedElementsRectColor.toRgbString());
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'stroke-width', '1');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'fill', 'rgba(0, 0, 0, 0)');
        this.renderer.setAttribute(this.svgSelectedElementsRect, 'cursor', 'move');
        // this.renderer.setAttribute(this.svgSelectedElementsRect, 'pointer-events', 'auto'); // TODO: check if necessary

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[i], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'fill', selectedElementsRectColor.toRgbString());
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
        this.drawingService.addUiElement(this.svgSelectedElementsRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.addUiElement(controlPoint);
        }
    }

    private hideSelectedElementsRect(): void {
        if (!this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = false;
        this.drawingService.removeUiElement(this.svgSelectedElementsRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.removeUiElement(controlPoint);
        }
    }

    private updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }
}
