import { Injectable } from '@angular/core';
import { Tool } from '../../classes/tools/tool';

@Injectable({
    providedIn: 'root',
})
export class ToolService {
    tool: Tool;
}
