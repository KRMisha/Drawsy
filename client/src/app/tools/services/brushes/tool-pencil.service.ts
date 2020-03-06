import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPencilService extends ToolBrush {
    constructor(drawingService: DrawingService, colorService: ColorService, commandService: CommandService) {
        super(drawingService, colorService, commandService, ToolNames.Pencil);
    }
}
