import { Injectable } from '@angular/core';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { Tool } from '@app/tools/services/tool';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolRectangleService } from '@app/tools/services/tool-rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(tool1: ToolPencilService, tool2: ToolPaintbrushService, tool3: ToolLineService, tool4: ToolRectangleService) {
        this.tools = [tool1, tool2, tool3, tool4];
    }
}
