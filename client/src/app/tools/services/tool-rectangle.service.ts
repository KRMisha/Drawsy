import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { defaultSize, defaultStrokeType } from '@app/tools/enums/tool-defaults.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { StrokeType, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends Tool {
    private rectangle: SVGPathElement;
    private origin: Vec2;
    private mousePosition: Vec2;
    private isSquare = false;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService, ToolNames.Rectangle);
        this.toolSettings.set(ToolSetting.Size, defaultSize);
        this.toolSettings.set(ToolSetting.StrokeType, defaultStrokeType);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
        if (this.isMouseInside && this.isMouseDown) {
            this.updateRectanglePath();
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
        if (this.isMouseInside) {
            this.rectangle = this.createNewRectangle();
            this.origin = { x: event.offsetX, y: event.offsetY };
            this.updateRectanglePath();
            this.drawingService.addElement(this.rectangle);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isSquare = true;
            if (this.isMouseInside && this.isMouseDown) {
                this.updateRectanglePath();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isSquare = false;
            if (this.isMouseInside && this.isMouseDown) {
                this.updateRectanglePath();
            }
        }
    }

    onEnter(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onLeave(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onPrimaryColorChange(color: Color): void {
        if (this.isMouseInside && this.isMouseDown) {
            this.renderer.setAttribute(this.rectangle, 'fill', color.toRgbaString());
        }
    }

    onSecondaryColorChange(color: Color): void {
        if (this.isMouseInside && this.isMouseDown) {
            this.renderer.setAttribute(this.rectangle, 'stroke', color.toRgbaString());
        }
    }

    private createNewRectangle(): SVGPathElement {
        const rectangle: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(rectangle, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(rectangle, 'stroke-linecap', 'square');
        this.renderer.setAttribute(rectangle, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(rectangle, 'stroke', this.colorService.getSecondaryColor().toRgbaString());
        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.FillOnly) {
            this.renderer.setAttribute(rectangle, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeType.BorderOnly) {
            this.renderer.setAttribute(rectangle, 'fill', 'none');
        }
        return rectangle;
    }

    private updateRectanglePath(): void {
        this.renderer.setAttribute(this.rectangle, 'd', this.getRectangleString(this.mousePosition));
    }

    private getRectangleString(position: Vec2): string {
        const positionCopy = { x: position.x, y: position.y };
        if (this.isSquare) {
            const maxSideLength: number = Math.max(Math.abs(positionCopy.x - this.origin.x), Math.abs(positionCopy.y - this.origin.y));

            if (positionCopy.x < this.origin.x) {
                positionCopy.x = this.origin.x - maxSideLength;
            } else {
                positionCopy.x = this.origin.x + maxSideLength;
            }

            if (positionCopy.y < this.origin.y) {
                positionCopy.y = this.origin.y - maxSideLength;
            } else {
                positionCopy.y = this.origin.y + maxSideLength;
            }
        }

        return `M${this.origin.x} ${this.origin.y} H${positionCopy.x} V${positionCopy.y} H${this.origin.x} V${this.origin.y} `;
    }
}