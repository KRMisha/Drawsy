import { Injectable, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolInfo from '@app/tools/constants/tool-info';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPaintbrushService extends ToolBrush {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService
    ) {
        super(rendererFactory, drawingService, colorService, historyService, ToolInfo.Paintbrush);
        this.settings.brushTexture = ToolDefaults.defaultBrushTexture;
    }

    protected createPath(): SVGPathElement {
        const path = super.createPath();
        // tslint:disable-next-line: no-non-null-assertion
        this.renderer.setAttribute(path, 'filter', `url(#brushTexture${this.settings.brushTexture!})`);
        return path;
    }
}
