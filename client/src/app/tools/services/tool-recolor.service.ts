import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
// import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolRecolorService extends Tool {
    constructor(protected drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService, ToolNames.Recolor);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseDown) {
            return;
        }
        this.isMouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        const selectedElement = this.drawingService.getElementsUnderPoint(this.getMousePosition(event))[0];
        if (selectedElement === undefined) {
            return;
        }

        if (event.button === ButtonId.Left) {
            if (selectedElement.getAttribute('fill') !== 'none') {
                this.renderer.setAttribute(selectedElement, 'fill', this.colorService.getPrimaryColor().toRgbaString());
            }
        } else if (event.button === ButtonId.Right) {
            console.log('RIGHT');
            if (selectedElement.getAttribute('stroke') !== 'none') {
                this.renderer.setAttribute(selectedElement, 'stroke', this.colorService.getSecondaryColor().toRgbaString());
            }
        }
    }
}
