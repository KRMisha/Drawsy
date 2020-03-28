import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { Subscription } from 'rxjs';
import { ToolSelectionStateService } from './tool-selection-state.service';

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

    private selectedElementsChanged: Subscription;

    constructor(
        private svgUtilityService: SvgUtilityService,
        private drawingService: DrawingService,
        private rendererFactory: RendererFactory2,
        private toolSelectionStateService: ToolSelectionStateService
    ) {
        this.selectedElementsChanged = this.toolSelectionStateService.selectedElementsChanged$.subscribe((elements: SVGGraphicsElement[]) => {
            if (elements.length === 0) {
                this.hideSvgSelectedShapesRect();
            } else {
                this.updateSvgSelectedShapesRect(elements);
            }
        });

        this.renderer = this.rendererFactory.createRenderer(null, null);

        this.svgSelectedShapesRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke-width', '2');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'stroke', '#000000');
        this.renderer.setAttribute(this.svgSelectedShapesRect, 'fill', 'none');

        const borderColor = Color.fromRgb(49, 104, 142); // tslint:disable-line: no-magic-numbers
        this.svgUserSelectionRect = this.svgUtilityService.createDashedRectBorder(borderColor);

        const controlPointsCount = 4;
        for (let i = 0; i < controlPointsCount; i++) {
            this.svgControlPoints.push(this.renderer.createElement('rect', 'svg'));
            this.renderer.setAttribute(this.svgControlPoints[i], 'width', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'height', controlPointSideSize.toString());
            this.renderer.setAttribute(this.svgControlPoints[i], 'fill', 'black');
            this.renderer.setAttribute(this.svgControlPoints[i], 'pointer-events', 'auto');
            this.drawingService.addUiElement(this.svgControlPoints[i]);
        }
    }

    ngOnDestroy(): void {
        this.selectedElementsChanged.unsubscribe();
    }

    updateSvgSelectedShapesRect(selectedElement: SVGGraphicsElement[]): void {
        const elementsBounds = this.svgUtilityService.getElementListBounds(selectedElement);
        if (elementsBounds !== undefined) {
            this.svgUtilityService.updateSvgRectFromRect(this.svgSelectedShapesRect, elementsBounds);

            const positions = [
                { x: elementsBounds.x, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y } as Vec2,
                { x: elementsBounds.x + elementsBounds.width, y: elementsBounds.y + elementsBounds.height / 2 } as Vec2,
                { x: elementsBounds.x + elementsBounds.width / 2, y: elementsBounds.y + elementsBounds.height } as Vec2,
            ];
            for (let i = 0; i < positions.length; i++) {
                this.svgControlPoints[i].setAttribute('x', (positions[i].x - controlPointSideSize / 2).toString());
                this.svgControlPoints[i].setAttribute('y', (positions[i].y - controlPointSideSize / 2).toString());
            }
            this.showSvgSelectedShapesRect();
        } else {
            this.hideSvgSelectedShapesRect();
        }
        this.toolSelectionStateService.updateSelectionRect();
    }

    showSvgSelectedShapesRect(): void {
        if (this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = true;
        this.drawingService.addUiElement(this.svgSelectedShapesRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.addUiElement(controlPoint);
        }
    }

    hideSvgSelectedShapesRect(): void {
        if (!this.isSelectionDisplayed) {
            return;
        }
        this.isSelectionDisplayed = false;
        this.drawingService.removeUiElement(this.svgSelectedShapesRect);
        for (const controlPoint of this.svgControlPoints) {
            this.drawingService.removeUiElement(controlPoint);
        }
    }
}
