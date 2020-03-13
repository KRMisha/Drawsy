import { Injectable } from '@angular/core';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { Tool } from '@app/tools/services/tool';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolPolygonService } from './shapes/tool-polygon.service';
import { ToolEraserService } from './tool-eraser.service';
import { ToolEyedropperService } from './tool-eyedropper.service';
import { ToolRecolorService } from './tool-recolor.service';
import { ToolSprayCanService } from './tool-spray-can.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(
        private tool1: ToolPencilService,
        private tool2: ToolPaintbrushService,
        private tool3: ToolLineService,
        private tool4: ToolRectangleService,
        private tool5: ToolEllipseService,
        private tool6: ToolPolygonService,
        private tool7: ToolEyedropperService,
        private tool8: ToolSelectionService,
        private tool9: ToolEraserService,
        private tool10: ToolSprayCanService,
        private tool11: ToolRecolorService,
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
