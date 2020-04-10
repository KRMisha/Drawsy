import { Injectable } from '@angular/core';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ServerService } from '@app/shared/services/server.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    constructor(
        private drawingSerializerService: DrawingSerializerService,
        private drawingService: DrawingService,
        private serverService: ServerService
    ) {}

    exportDrawing(drawingRoot: SVGSVGElement, fileType: FileType): void {
        this.drawingSerializerService.exportDrawing(drawingRoot, this.drawingService.title, fileType);
    }

    async sendEmail(drawingRoot: SVGSVGElement, emailAddress: string, fileType: FileType): Promise<void> {
        const formData = new FormData();
        const blob = this.drawingSerializerService.exportAsBlob(drawingRoot);
        formData.append('to', emailAddress);
        formData.append('payload', blob, this.drawingService.title + '.' + fileType);
        this.serverService.sendEmail(formData).subscribe(
            () => {
                console.log('whattt');
            },
            () => {
                console.log('ERRORR');
            }
        );
    }
}
