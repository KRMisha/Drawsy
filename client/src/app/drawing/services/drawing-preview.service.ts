import { Injectable } from '@angular/core';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
// import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingPreviewService {
    drawingFilter = DrawingFilter.None;
}
