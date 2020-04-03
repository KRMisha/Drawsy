import { Injectable } from '@angular/core';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    fileType = FileType.Svg;

    constructor(private drawingSerializerService: DrawingSerializerService, private drawingService: DrawingService) {}

    exportDrawing(drawingRoot: SVGSVGElement): void {
        this.drawingSerializerService.exportDrawing(this.drawingService.title, this.fileType, drawingRoot);
    }
}
