import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';
import { Textures, ToolSetting } from '@app/tools/services/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolPaintbrushService extends ToolBrush {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.toolSettings.set(ToolSetting.Texture, Textures.Texture1);
        this.name = 'Pinceau';
    }

    protected createNewPath(): SVGPathElement {
        const path = super.createNewPath();
        this.renderer.setAttribute(path, 'filter', 'url(#texture' + this.toolSettings.get(ToolSetting.Texture) + ')');
        return path;
    }
}
