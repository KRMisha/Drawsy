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
        tool1: ToolPencilService,
        tool2: ToolPaintbrushService,
        tool3: ToolLineService,
        tool4: ToolRectangleService,
        tool5: ToolSelectionService,
        tool6: ToolEllipseService,
        tool7: ToolPolygonService,
        tool8: ToolEyedropperService,
    ) {
        this.tools = [tool1, tool2, tool3, tool4, tool5, tool6, tool7, tool8];
    }
}
