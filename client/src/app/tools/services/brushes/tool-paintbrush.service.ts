import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPaintbrushService extends ToolBrush {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService
    ) {
        super(rendererFactory, drawingService, colorService, commandService, ToolInfo.Paintbrush);
        this.toolSettings.set(ToolSetting.BrushTexture, ToolDefaults.defaultBrushTexture);
    }

    protected createNewPath(): SVGPathElement {
        const path = super.createNewPath();
        this.renderer.setAttribute(path, 'filter', `url(#brushTexture${this.toolSettings.get(ToolSetting.BrushTexture)})`);
        return path;
    }
}
