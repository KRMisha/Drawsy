import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';

@Component({
    selector: 'app-drawing-preview',
    templateUrl: './drawing-preview.component.html',
    styleUrls: ['./drawing-preview.component.scss'],
})
export class DrawingPreviewComponent implements AfterViewInit {
    @ViewChild('appDrawingRoot') private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appTitle') private svgTitle: ElementRef<SVGTitleElement>;
    @ViewChild('appDesc') private svgDesc: ElementRef<SVGDescElement>;
    @ViewChild('appDefs') private svgDefs: ElementRef<SVGDefsElement>;
    @ViewChild('appDrawingContent') private svgDrawingContent: ElementRef<SVGGElement>;

    constructor(private drawingPreviewService: DrawingPreviewService) {}

    ngAfterViewInit(): void {
        this.drawingPreviewService.drawingPreviewRoot = this.drawingRoot.nativeElement;
        this.drawingPreviewService.svgTitle = this.svgTitle.nativeElement;
        this.drawingPreviewService.svgDesc = this.svgDesc.nativeElement;
        this.drawingPreviewService.svgDefs = this.svgDefs.nativeElement;
        this.drawingPreviewService.svgDrawingContent = this.svgDrawingContent.nativeElement;

        this.drawingPreviewService.initializePreview();
    }

    get backgroundColor(): string {
        return this.drawingPreviewService.backgroundColor.toRgbaString();
    }

    get drawingFilter(): DrawingFilter {
        return this.drawingPreviewService.drawingFilter;
    }
}
