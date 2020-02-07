import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

interface Coords {
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root',
})
export class ToolRectangleService extends Tool {
    private rectangle: SVGPathElement;
    private origin: Coords;
    private mousePosition: Coords;
    private isSquare = false;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Color, new Color(0, 0, 0, 1));
        this.toolSettings.set(ToolSetting.Size, 1);
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
        if (this.isMouseInside && this.isMouseDown) {
            this.updateRectanglePath();
        }
    }

    onMouseDown(event: MouseEvent) {
        if (this.isMouseInside) {
            this.rectangle = this.createNewRectangle();
            this.origin = { x: event.offsetX, y: event.offsetY };
            this.updateRectanglePath();
            this.drawingService.addElement(this.rectangle);
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.isSquare = true;
            if (this.isMouseInside && this.isMouseDown) {
                this.updateRectanglePath();
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.isSquare = false;
            console.log(this.isSquare.toString());
            if (this.isMouseInside && this.isMouseDown) {
                console.log(this.mousePosition.x, this.mousePosition.y);
                this.updateRectanglePath();
            }
        }
    }

    onEnter(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.rectangle = this.createNewRectangle();
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.origin = this.mousePosition;
            this.renderer.setAttribute(this.rectangle, 'd', this.getRectangleString(this.mousePosition));
            this.drawingService.addElement(this.rectangle);
        }
    }

    onLeave(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.isMouseDown = false;
        }
    }

    private createNewRectangle(): SVGPathElement {
        const rectangle: SVGPathElement = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(rectangle, 'fill', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(rectangle, 'stroke', `${this.colorService.getSecondaryColor().toRgbaString()}`);
        this.renderer.setAttribute(rectangle, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        return rectangle;
    }

    private updateRectanglePath(): void {
        this.renderer.setAttribute(this.rectangle, 'd', this.getRectangleString(this.mousePosition));
    }

    private getRectangleString(position: Coords): string {
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

        return (
            'M' +
            this.origin.x.toString() +
            ' ' +
            this.origin.y.toString() +
            ' ' +
            'H' +
            positionCopy.x.toString() +
            ' ' +
            'V' +
            positionCopy.y.toString() +
            ' ' +
            'H' +
            this.origin.x.toString() +
            ' ' +
            'V' +
            this.origin.y.toString() +
            ' '
        );
    }
}
