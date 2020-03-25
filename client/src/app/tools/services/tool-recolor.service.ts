import { Injectable, RendererFactory2 } from '@angular/core';
import { RecolorCommand } from '@app/drawing/classes/commands/recolor-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
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
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Recolor);
    }

    onElementClick(event: MouseEvent, element: SVGElement): void {
        if (event.button !== MouseButton.Left && event.button !== MouseButton.Right) {
            return;
        }

        const attributesBefore = this.getAttributesMap(element);

        const elementType = (element as Node).nodeName;
        switch (elementType) {
            case 'path': {
                if (event.button === MouseButton.Left) {
                    this.renderer.setAttribute(element, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
                }
                break;
            }
            case 'rect':
            case 'polygon':
            case 'ellipse':
                const isLeftClick = event.button === MouseButton.Left;
                const colorToApply = isLeftClick ? this.colorService.getPrimaryColor() : this.colorService.getSecondaryColor();
                const attributeToChange = isLeftClick ? 'fill' : 'stroke';
                const attributeValue = element.getAttribute(attributeToChange);

                if (attributeValue && attributeValue !== 'none') {
                    this.renderer.setAttribute(element, attributeToChange, colorToApply.toRgbaString());
                }
                break;
            default: {
                if (event.button === MouseButton.Left) {
                    this.renderer.setAttribute(element, 'fill', this.colorService.getPrimaryColor().toRgbaString());
                    this.renderer.setAttribute(element, 'stroke', this.colorService.getPrimaryColor().toRgbaString());
                }
            }
        }

        const attributesAfter = this.getAttributesMap(element);
        this.commandService.addCommand(new RecolorCommand(element, attributesBefore, attributesAfter));
    }

    private getAttributesMap(element: SVGElement): Map<string, string | undefined> {
        const map = new Map<string, string | undefined>();
        map.set('fill', element.getAttribute('fill') || undefined);
        map.set('stroke', element.getAttribute('stroke') || undefined);
        return map;
    }
}
