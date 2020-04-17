import { Injectable } from '@angular/core';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';
import { ToolPolygonService } from '@app/tools/services/shapes/tool-polygon.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { Tool } from '@app/tools/services/tool';
import { ToolEraserService } from '@app/tools/services/tool-eraser.service';
import { ToolEyedropperService } from '@app/tools/services/tool-eyedropper.service';
import { ToolFillService } from '@app/tools/services/tool-fill.service';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(
        public toolPencilService: ToolPencilService,
        public toolPaintbrushService: ToolPaintbrushService,
        public toolLineService: ToolLineService,
        public toolSprayCanService: ToolSprayCanService,
        public toolRectangleService: ToolRectangleService,
        public toolEllipseService: ToolEllipseService,
        public toolPolygonService: ToolPolygonService,
        public toolFillService: ToolFillService,
        public toolEyedropperService: ToolEyedropperService,
        public toolRecolorService: ToolRecolorService,
        public toolSelectionService: ToolSelectionService,
        public toolEraserService: ToolEraserService
    ) {
        this.tools = [
            this.toolPencilService,
            this.toolPaintbrushService,
            this.toolLineService,
            this.toolSprayCanService,
            this.toolRectangleService,
            this.toolEllipseService,
            this.toolPolygonService,
            this.toolFillService,
            this.toolEyedropperService,
            this.toolRecolorService,
            this.toolSelectionService,
            this.toolEraserService,
        ];
    }
}
