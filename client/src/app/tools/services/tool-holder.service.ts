import { Injectable } from '@angular/core';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { Tool } from '@app/tools/services/tool';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolSelectionService } from '@app/tools/services/tool-selection.service';
import { ToolPolygonService } from './shapes/tool-polygon.service';
import { ToolEyedropperService } from './tool-eyedropper.service';

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
        private tool5: ToolSelectionService,
        private tool6: ToolEllipseService,
        private tool7: ToolPolygonService,
        private tool8: ToolEyedropperService,
    ) {
        this.tools = [this.tool1, this.tool2, this.tool3, this.tool4, this.tool5, this.tool6, this.tool7, this.tool8];
    }
}
