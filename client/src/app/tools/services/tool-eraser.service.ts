import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { RemoveElementsCommand } from '@app/drawing/classes/commands/remove-elements-command';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { defaultSize } from '@app/tools/enums/tool-defaults.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from './tool';

@Injectable({
    providedIn: 'root',
})
export class ToolEraserService extends Tool {
    private eraserSize = defaultSize;
    private svgEraserElement: SVGRectElement;
    private svgSelectedShapeRect: SVGRectElement;

    private svgElementUnderCursor?: SVGElement = undefined;
    private elementUnderCursorStrokeWidth: string;
    private elementUnderCursorStrokeColor: string;

    private isMouseDownInside = false;

    private svgElementsDeletedDuringDrag: SVGElement[] = [];

    private drawingElementsCopy: SVGElement[] = [];

    constructor(protected drawingService: DrawingService, private commandService: CommandService) {
        super(drawingService, ToolName.Eraser);
        this.toolSettings.set(ToolSetting.EraserSize, defaultSize);
    }

    afterDrawingInit(): void {
        this.svgEraserElement = this.renderer.createElement('rect', 'svg');
        this.svgEraserElement.setAttribute('fill', 'white');
        this.svgEraserElement.setAttribute('stroke', 'black');
        this.svgEraserElement.setAttribute('stroke-width', '1');
        this.drawingService.addUiElement(this.svgEraserElement);

        this.svgSelectedShapeRect = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'fill', 'none');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'stroke-dasharray', '1, 7');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'stroke-width', '4');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'stroke', 'rgba(235, 64, 52, 0.8)');
        this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
        this.drawingService.addUiElement(this.svgSelectedShapeRect);
    }

    onMouseMove(event: MouseEvent): void {
        this.onMousePositionChange(this.getMousePosition(event));
    }

    onMouseDown(event: MouseEvent): void {
        this.isMouseDownInside = Tool.isMouseInside;
        this.drawingElementsCopy = [...this.drawingService.svgElements];
        this.onMousePositionChange(this.getMousePosition(event));
    }

    onMouseUp(event: MouseEvent): void {
        if (this.svgElementsDeletedDuringDrag.length > 0) {
            this.svgElementsDeletedDuringDrag.sort((element1: SVGElement, element2: SVGElement) => {
                return this.drawingElementsCopy.indexOf(element1) - this.drawingElementsCopy.indexOf(element2);
            });
            this.commandService.addCommand(new RemoveElementsCommand(this.drawingService, this.svgElementsDeletedDuringDrag));
            this.svgElementsDeletedDuringDrag = [];
        }
    }

    onEnter(): void {
        this.renderer.setAttribute(this.svgEraserElement, 'display', 'block');
    }

    onLeave(): void {
        this.renderer.setAttribute(this.svgEraserElement, 'display', 'none');
    }

    onToolDeselection(): void {
        this.svgEraserElement.setAttribute('display', 'none');
        this.svgSelectedShapeRect.setAttribute('display', 'none');
    }

    private onMousePositionChange(mousePosition: Vec2): void {
        this.eraserSize = this.toolSettings.get(ToolSetting.EraserSize) as number;
        const eraserRect = this.getEraserRectFromMousePosition(mousePosition);
        this.updateVisibleRect(this.svgEraserElement, eraserRect);

        const elementsUnderEraser = this.drawingService.getElementsUnderArea(eraserRect);
        if (elementsUnderEraser.length === 0) {
            this.restoreElementUnderCursorAttributes();
            this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
            this.svgElementUnderCursor = undefined;
            return;
        }

        const elementToConsider = elementsUnderEraser[elementsUnderEraser.length - 1];
        if (elementToConsider !== this.svgElementUnderCursor) {
            this.restoreElementUnderCursorAttributes();
            this.svgElementUnderCursor = elementToConsider;
            this.addRedBorderToElement(elementToConsider);
            this.displayRedRectAroundElement(elementToConsider);
        }

        if (this.svgElementUnderCursor !== undefined && Tool.isMouseDown && this.isMouseDownInside) {
            this.restoreElementUnderCursorAttributes();
            this.renderer.setAttribute(this.svgSelectedShapeRect, 'display', 'none');
            this.drawingService.removeElement(this.svgElementUnderCursor);
            this.svgElementsDeletedDuringDrag.push(this.svgElementUnderCursor);
            this.svgElementUnderCursor = undefined;
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

        const defaultBorderWidth = 3;
        let borderWidth = defaultBorderWidth;
        if (this.elementUnderCursorStrokeWidth !== 'none') {
            const borderIncreaseFactor = 1.08;
            borderWidth += +this.elementUnderCursorStrokeWidth * borderIncreaseFactor;
        }

        this.renderer.setAttribute(element, 'stroke', borderColor);
        this.renderer.setAttribute(element, 'stroke-width', borderWidth.toString());
    }

    private restoreElementUnderCursorAttributes(): void {
        if (this.svgElementUnderCursor !== undefined) {
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke', this.elementUnderCursorStrokeColor);
            this.renderer.setAttribute(this.svgElementUnderCursor, 'stroke-width', this.elementUnderCursorStrokeWidth);
        }
    }

    private getColorFromStr(str: string): Color {
        const vals = str.substring(str.indexOf('(') + 1, str.length - 1).split(', ');
        return Color.fromRgb(+vals[0], +vals[1], +vals[2]);
    }

    private displayRedRectAroundElement(element: SVGElement): void {
        const rect = this.drawingService.getElementBounds(element);
        this.updateVisibleRect(this.svgSelectedShapeRect, rect);
        this.renderer.setAttribute(this.svgElementUnderCursor, 'display', 'block');
    }
}
