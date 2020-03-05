import { Injectable } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolNames } from '@app/tools/enums/tool-names.enum';
import { ToolBrush } from '@app/tools/services/brushes/tool-brush';

@Injectable({
    providedIn: 'root',
})
export class ToolPencilService extends ToolBrush {
    constructor(protected drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService, ToolNames.Pencil);
    }
}
