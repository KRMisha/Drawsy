import { Injectable } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from '../../../../classes/color/color';
import { DrawingService } from '../../drawing.service';
import { Tool, ToolSetting } from '../tool';

@Injectable({
    providedIn: 'root'
})
export class ToolLineService extends Tool {

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.toolSettings.set(ToolSetting.Color, new Color(0, 0, 0, 1));
        this.toolSettings.set(ToolSetting.Size, 1);
    }
}
