import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { defaultTexture } from '@app/tools/enums/tool-defaults.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPaintbrushService extends ToolBrush {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.toolSettings.set(ToolSetting.Texture, defaultTexture);
        this.name = 'Pinceau';
    }

    protected createNewPath(): SVGPathElement {
        const path = super.createNewPath();
        this.renderer.setAttribute(path, 'filter', `url(#brushTexture${this.toolSettings.get(ToolSetting.Texture)})`);
        return path;
    }
}
