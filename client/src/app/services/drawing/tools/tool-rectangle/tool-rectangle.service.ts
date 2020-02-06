import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

@Injectable({
    providedIn: 'root'
})
export class ToolRectangleService extends Tool {
    private rectangle: SVGRectElement;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Color, new Color(0, 0, 0, 1));
        this.toolSettings.set(ToolSetting.Size, 1);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.renderer.setAttribute(this.rectangle, 'width', `${event.offsetX - this.rectangle.getBBox().x}`);
            this.renderer.setAttribute(this.rectangle, 'height', `${event.offsetY - this.rectangle.getBBox().y}`);
        }
    }

    onMouseDown(event: MouseEvent) {
        this.rectangle = this.createNewRectangle(event.offsetX, event.offsetY);
        this.drawingService.addElement(this.rectangle);
    }

    private createNewRectangle(positionX: number, positionY: number): SVGRectElement {
        const rectangle = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(rectangle, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(rectangle, 'stroke', `${this.colorService.getSecondaryColor().toRgbaString()}`);
        this.renderer.setAttribute(rectangle, 'fill', `${this.colorService.getPrimaryColor().toRgbaString()}`);
        this.renderer.setAttribute(rectangle, 'stroke-width', `${this.toolSettings.get(ToolSetting.Size)}`);
        this.renderer.setAttribute(rectangle, 'x', `${positionX}`);
        this.renderer.setAttribute(rectangle, 'y', `${positionY}`);
        return rectangle;
    }
}
