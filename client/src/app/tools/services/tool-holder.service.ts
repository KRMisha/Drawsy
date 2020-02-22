import { Injectable } from '@angular/core';
import { ToolPaintbrushService } from './brushes/tool-paintbrush/tool-paintbrush.service';
import { ToolPencilService } from './brushes/tool-pencil/tool-pencil.service';
import { Tool } from './tool';
import { ToolLineService } from './tool-line/tool-line.service';
import { ToolRectangleService } from './tool-rectangle/tool-rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(tool1: ToolPencilService, tool2: ToolPaintbrushService, tool3: ToolLineService, tool4: ToolRectangleService) {
        this.tools = [tool1, tool2, tool3, tool4];
    }
}
