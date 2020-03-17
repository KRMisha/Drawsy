import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import ToolDefaults from '@app/tools/enums/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPaintbrushService extends ToolBrush {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolName.Brush);
        this.toolSettings.set(ToolSetting.Texture, ToolDefaults.defaultTexture);
    }

    protected createNewPath(): SVGPathElement {
        const path = super.createNewPath();
        this.renderer.setAttribute(path, 'filter', `url(#brushTexture${this.toolSettings.get(ToolSetting.Texture)})`);
        return path;
    }
}
