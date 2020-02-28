import { Component } from '@angular/core';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';

@Component({
    selector: 'app-import-drawing',
    templateUrl: './import-drawing.component.html',
    styleUrls: ['./import-drawing.component.scss'],
})
export class ImportDrawingComponent {
    constructor(private drawingSerializerService: DrawingSerializerService) {}

    onChange(fileList: FileList): void {
        this.drawingSerializerService.importSelectedDrawing(fileList);
    }
}
