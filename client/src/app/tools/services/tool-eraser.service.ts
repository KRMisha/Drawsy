import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { defaultSize } from '@app/tools/enums/tool-defaults.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolNames } from '../enums/tool-names.enum';
import { Tool } from './tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEraserService extends Tool {
    private eraserSize = defaultSize;
    private svgEraserElement: SVGRectElement;

    private svgElementUnderCursor: SVGElement | null = null;
    private elementUnderCursorStrokeWidth: string;
    private elementUnderCursorStrokeColor: string;

    private svgElementsDeletedDuringDrag: SVGElement[];

    constructor(protected drawingService: DrawingService) {
        super(drawingService, ToolNames.Eraser);
        this.toolSettings.set(ToolSetting.EraserSize, defaultSize);
    }

    afterDrawingInit(): void {
        this.svgEraserElement = this.renderer.createElement('rect', 'svg');
        this.svgEraserElement.setAttribute('fill', 'white');
        this.svgEraserElement.setAttribute('stroke', 'black');
        this.svgEraserElement.setAttribute('stroke-width', '1');
        this.drawingService.addUiElement(this.svgEraserElement);
    }

    onMouseMove(event: MouseEvent): void {
        this.onMousePositionChange(this.getMousePosition(event));
    }

    onMouseDown(event: MouseEvent): void {
        this.onMousePositionChange(this.getMousePosition(event));
    }

    onMouseUp(event: MouseEvent): void {
        // Undo-redo with svgElementsDeletedDuringDrag
        this.svgElementsDeletedDuringDrag = [];
    }

    onToolDeselection(): void {
        this.svgEraserElement.setAttribute('display', 'none');
    }

    private onMousePositionChange(mousePosition: Vec2): void {
        this.eraserSize = this.toolSettings.get(ToolSetting.EraserSize) as number;
        const eraserRect = this.getEraserRectFromMousePosition(mousePosition);
        this.updateVisibleRect(this.svgEraserElement, eraserRect);
        const elementsUnderEraser = this.drawingService.getElementsUnderArea(eraserRect);
        if (elementsUnderEraser.length === 0) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = null;
            return;
        }
        const elementToConsider = elementsUnderEraser[elementsUnderEraser.length - 1];
        if (elementToConsider !== this.svgElementUnderCursor) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = elementToConsider;
            this.addRedBorderToElement(elementToConsider);
        }

        if (this.svgElementUnderCursor && this.isMouseDown) {
            this.drawingService.removeElement(this.svgElementUnderCursor);
            this.svgElementsDeletedDuringDrag.push(this.svgElementUnderCursor);
            this.svgElementUnderCursor = null;
        }
    }

    private getEraserRectFromMousePosition(mousePosition: Vec2): Rect {
        const rect: Rect = {
            x: mousePosition.x - this.eraserSize / 2,
            y: mousePosition.y - this.eraserSize / 2,
            width: this.eraserSize,
            height: this.eraserSize,
        };
        return rect;
    }

    private updateVisibleRect(element: SVGRectElement, rect: Rect): void {
        this.drawingService.updateSvgRectFromRect(element, rect);
        this.renderer.setAttribute(element, 'display', 'block');
    }

    private addRedBorderToElement(element: SVGElement): void {
        const elementStrokeWidth = element.getAttribute('stroke-width');
        const elementStrokeColor = element.getAttribute('stroke');

        this.elementUnderCursorStrokeColor = elementStrokeColor ? elementStrokeColor : 'none';
        this.elementUnderCursorStrokeWidth = elementStrokeWidth ? elementStrokeWidth : 'none';

        let borderColor = 'rgb(255, 0, 0)';
        if (this.elementUnderCursorStrokeColor !== 'none') {
            const elementColor = this.getColorFromStr(this.elementUnderCursorStrokeColor);
            const distanceFromRed = Math.sqrt(
                Math.pow(elementColor.red - Color.maxRgb, 2) + Math.pow(elementColor.green, 2) + Math.pow(elementColor.blue, 2),
            );
            const maxDistanceFromRed = 45;
            if (distanceFromRed <= maxDistanceFromRed) {
                borderColor = 'rgb(165, 0, 0)';
            }
        }

        const defaultBorderWidth = 10;
        let borderWidth = defaultBorderWidth;
        if (this.elementUnderCursorStrokeWidth !== 'none') {
            borderWidth = +this.elementUnderCursorStrokeWidth + defaultBorderWidth;
        }

        this.renderer.setAttribute(element, 'stroke', borderColor);
        this.renderer.setAttribute(element, 'stroke-width', borderWidth.toString());
    }

    private restoreElementUnderCursorAttributes(): void {
        if (this.svgElementUnderCursor) {
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke', this.elementUnderCursorStrokeColor);
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke-width', this.elementUnderCursorStrokeWidth);
        }
    }

    private getColorFromStr(str: string): Color {
        const vals = str.substring(str.indexOf('(') + 1, str.length - 1).split(', ');
        return Color.fromRgb(+vals[0], +vals[1], +vals[2]);
    }
}
