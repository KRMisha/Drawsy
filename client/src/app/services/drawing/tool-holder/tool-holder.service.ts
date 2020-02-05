import { Injectable } from '@angular/core';
import { Tool } from '../tools/tool';
import { ToolPencilService } from '../tools/tool-pencil/tool-pencil.service';

@Injectable({
    providedIn: 'root',
})
export class ToolHolderService {
    tools: Tool[];

    constructor(tool1: ToolPencilService) {
        this.tools = [tool1];
    }
}
