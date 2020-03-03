import { Component } from '@angular/core';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-import-drawing',
    templateUrl: './import-drawing.component.html',
    styleUrls: ['./import-drawing.component.scss'],
})
export class ImportDrawingComponent {
    constructor(private drawingSerializerService: DrawingSerializerService, private drawingService: DrawingService) {}

    onChange(fileList: FileList): void {
        this.drawingSerializerService.importSelectedDrawing(fileList, this.drawingService.getDrawingRoot());
    }
}
