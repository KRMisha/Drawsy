import { Injectable } from '@angular/core';
import { Tool } from '../tools/tool';
import { ToolBrushService } from '../tools/tool-brush/tool-brush.service';
import { ToolLineService } from '../tools/tool-line/tool-line.service';
import { ToolPencilService } from '../tools/tool-pencil/tool-pencil.service';
import { ToolRectangleService } from '../tools/tool-rectangle/tool-rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(tool1: ToolPencilService,
                tool2: ToolBrushService,
                tool3: ToolLineService,
                tool4: ToolRectangleService
                ) {
        this.tools = [tool1, tool2, tool3, tool4];
    }
}
