import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService, ToolNames.Selection);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            const svgElemUnderMouse = this.getSvgElementUnderMouse({ x: event.offsetX, y: event.offsetY });
            if (svgElemUnderMouse !== null) {
                const svgElementBounds = this.getSvgElementBounds(svgElemUnderMouse);
                this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'x', svgElementBounds.x.toString());
                this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'y', svgElementBounds.y.toString());
                this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'width', svgElementBounds.width.toString());
                this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'height', svgElementBounds.height.toString());
                this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'display', 'block');
                return;
            }
        }
        this.renderer.setAttribute(this.drawingService.svgSelectionShape, 'display', 'none');
    }

    private getSvgElementUnderMouse(mousePosition: Vec2): SVGElement | null {
        const svgElements = this.drawingService.getSvgElements();
        for (let i = svgElements.length - 1; i >= 0; i--) {
            if (this.isMouseInsideBox(mousePosition, this.getSvgElementBounds(svgElements[i]))) {
                return svgElements[i];
            }
        }
        return null;
    }

    private isMouseInsideBox(mousePosition: Vec2, box: DOMRect): boolean {
        return (
            mousePosition.x >= box.x &&
            mousePosition.x <= box.x + box.width &&
            mousePosition.y >= box.y &&
            mousePosition.y <= box.y + box.height
        );
    }

    private getSvgElementBounds(svgElement: SVGElement): DOMRect {
        const svgElementBounds = svgElement.getBoundingClientRect() as DOMRect;
        const rootBounds = this.drawingService.svgDrawingSurface.getBoundingClientRect() as DOMRect;

        return {
            x: svgElementBounds.x - rootBounds.x,
            y: svgElementBounds.y - rootBounds.y,
            width: svgElementBounds.width,
            height: svgElementBounds.height,
        } as DOMRect;
    }
}
