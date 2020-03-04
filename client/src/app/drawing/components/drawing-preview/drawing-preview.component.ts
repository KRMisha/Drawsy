import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';

@Component({
    selector: 'app-drawing-preview',
    templateUrl: './drawing-preview.component.html',
    styleUrls: ['./drawing-preview.component.scss'],
})
export class DrawingPreviewComponent implements OnInit {
    @ViewChild('appDrawingRoot', { static: false }) private drawingRoot: ElementRef<SVGSVGElement>;

    constructor(private drawingPreviewService: DrawingPreviewService) {}

    ngOnInit(): void {
        this.drawingPreviewService.setTarget(this.drawingRoot.nativeElement);
        this.drawingPreviewService.initializePreview();
    }

    getFilter(): string {
        return `url(#previewFilter${this.drawingPreviewService.previewFilter})`;
    }
}
