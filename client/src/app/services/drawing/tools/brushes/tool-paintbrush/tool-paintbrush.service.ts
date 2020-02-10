import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../../drawing.service';
import { Textures, ToolSetting } from '../../tool';
import { ToolBrush } from '../tool-brush';

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
