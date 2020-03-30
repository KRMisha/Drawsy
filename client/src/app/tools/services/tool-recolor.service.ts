import { Injectable, RendererFactory2 } from '@angular/core';
import { RecolorCommand } from '@app/drawing/classes/commands/recolor-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import ToolInfo from '@app/tools/constants/tool-info';
import { Tool } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolRecolorService extends Tool {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Recolor);
    }

    // Impertinent warning because of null to undefined stylistic conversions
    // tslint:disable-next-line: cyclomatic-complexity
    onElementClick(event: MouseEvent, element: SVGGraphicsElement): void {
        if (event.button !== MouseButton.Left && event.button !== MouseButton.Right) {
            return;
        }

        const strokeBefore = element.getAttribute('stroke') || undefined;
        const fillBefore = element.getAttribute('fill') || undefined;

        const elementType = element.nodeName;
        switch (elementType) {
            case 'rect':
            case 'polygon':
            case 'ellipse':
                const isLeftClick = event.button === MouseButton.Left;
                const attributeToChange = isLeftClick ? 'fill' : 'stroke';
                const colorToApply = isLeftClick ? this.colorService.primaryColor : this.colorService.secondaryColor;
                const attributeValue = element.getAttribute(attributeToChange) || undefined;

                if (attributeValue !== undefined && attributeValue !== 'none') {
                    this.renderer.setAttribute(element, attributeToChange, colorToApply.toRgbaString());
                }
                break;
            default: {
                if (event.button === MouseButton.Left) {
                    if (strokeBefore !== undefined && strokeBefore !== 'none') {
                        this.renderer.setAttribute(element, 'stroke', this.colorService.primaryColor.toRgbaString());
                    }
                    if (fillBefore !== undefined && fillBefore !== 'none') {
                        this.renderer.setAttribute(element, 'fill', this.colorService.primaryColor.toRgbaString());
                    }
                }
                break;
            }
        }

        const strokeAfter = element.getAttribute('stroke') || undefined;
        const fillAfter = element.getAttribute('fill') || undefined;

        this.commandService.addCommand(new RecolorCommand(element, strokeBefore, fillBefore, strokeAfter, fillAfter));
    }
}
