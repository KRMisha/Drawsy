import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { Subscription } from 'rxjs';

const controlPointSideSize = 10;

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionUiService implements OnDestroy {
    svgSelectedShapesRect: SVGRectElement;
    svgUserSelectionRect: SVGRectElement;
    svgControlPoints: SVGGraphicsElement[] = [];

    private renderer: Renderer2;

    private isSelectionDisplayed = false;

    private selectedElementsChangedSubscription: Subscription;

    constructor(
        rendererFactory: RendererFactory2,
        private drawingService: DrawingService,
        private toolSelectionStateService: ToolSelectionStateService,
        private toolSelectionCollisionService: ToolSelectionCollisionService
    ) {
        this.selectedElementsChangedSubscription = this.toolSelectionStateService.selectedElementsChanged$.subscribe(
            (elements: SVGGraphicsElement[]) => {
                this.updateSvgSelectedShapesRect(elements);
            }
        );

        this.renderer = rendererFactory.createRenderer(null, null);

        this.svgSelectedShapesRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke-width', '2');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke', '#000000');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'fill', 'rgba(0, 0, 0, 0)');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'pointer-events', 'auto');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'cursor', 'move');

        // Disable magic numbers false positive lint error for values in static named constructor
        const borderColor = Color.fromRgb(49, 104, 142); // tslint:disable-line: no-magic-numbers
        this.svgUserSelectionRect = this.createDashedRectBorder(borderColor);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[i], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'fill', 'black');
        }
    }

    ngOnDestroy(): void {
        this.selectedElementsChangedSubscription.unsubscribe();
    }

    updateSvgRectFromRect(svgRect: SVGRectElement, rect: Rect): void {
        this.renderer.setAttribute(svgRect, 'x', rect.x.toString());
        this.renderer.setAttribute(svgRect, 'y', rect.y.toString());
        this.renderer.setAttribute(svgRect, 'width', rect.width.toString());
        this.renderer.setAttribute(svgRect, 'height', rect.height.toString());
    }

    updateSvgSelectedShapesRect(selectedElement: SVGGraphicsElement[]): void {
        const elementsBounds = this.toolSelectionCollisionService.getElementListBounds(selectedElement);
        if (elementsBounds !== undefined) {
            this.updateSvgRectFromRect(this.svgSelectedShapesRect, elementsBounds);

            const positions = [
                { x: elementsBounds.x, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y } as Vec2,
                { x: elementsBounds.x + elementsBounds.width, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y + elementsBounds.height } as Vec2,
            ];
            for (let i = 0; i < positions.length; i++) {
                this.renderer.setAttribute(this.svgControlPoints[i], 'x', `${positions[i].x - controlPointSideSize / 2}`);
                this.renderer.setAttribute(this.svgControlPoints[i], 'y', `${positions[i].y - controlPointSideSize / 2}`);
            }
            this.showSvgSelectedShapesRect();
        } else {
            this.hideSvgSelectedShapesRect();
        }
        this.toolSelectionStateService.updateSelectedElementsRect();
    }

    private showSvgSelectedShapesRect(): void {
        if (this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = true;
        this.drawingService.addUiElement(this.svgSelectedShapesRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.addUiElement(controlPoint);
        }
    }

    private hideSvgSelectedShapesRect(): void {
        if (!this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = false;
        this.drawingService.removeUiElement(this.svgSelectedShapesRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.removeUiElement(controlPoint);
        }
    }

    private createDashedRectBorder(color: Color): SVGRectElement {
        const svgRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(svgRect, 'fill', `rgba(${color.red}, ${color.green}, ${color.blue}, 0.2)`);
        this.renderer.setAttribute(svgRect, 'stroke-dasharray', '5, 3');
        this.renderer.setAttribute(svgRect, 'stroke-width', '2');
        this.renderer.setAttribute(svgRect, 'stroke-linecap', 'round');
        this.renderer.setAttribute(svgRect, 'stroke', `rgba(${color.red}, ${color.green}, ${color.blue}, 0.8)`);
        return svgRect;
    }
}
