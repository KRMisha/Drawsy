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
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(
        private tool1: ToolPencilService,
        private tool2: ToolPaintbrushService,
        private tool3: ToolLineService,
        private tool4: ToolSprayCanService,
        private tool5: ToolRectangleService,
        private tool6: ToolEllipseService,
        private tool7: ToolPolygonService,
        private tool8: ToolEyedropperService,
        private tool9: ToolRecolorService,
        private tool10: ToolSelectionService,
        private tool11: ToolEraserService
    ) {
        this.tools = [
            this.tool1,
            this.tool2,
            this.tool3,
            this.tool4,
            this.tool5,
            this.tool6,
            this.tool7,
            this.tool8,
            this.tool9,
            this.tool10,
            this.tool11,
        ];
    }
}
