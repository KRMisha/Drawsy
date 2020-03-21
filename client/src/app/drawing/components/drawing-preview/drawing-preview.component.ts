import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';

@Component({
    selector: 'app-drawing-preview',
    templateUrl: './drawing-preview.component.html',
    styleUrls: ['./drawing-preview.component.scss'],
})
export class DrawingPreviewComponent implements AfterViewInit, OnDestroy {
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

    ngOnDestroy(): void {
        delete this.drawingPreviewService.drawingPreviewRoot;
        delete this.drawingPreviewService.svgTitle;
        delete this.drawingPreviewService.svgDesc;
        delete this.drawingPreviewService.svgDefs;
        delete this.drawingPreviewService.svgDrawingContent;
    }

    getBackgroundColor(): string {
        return this.drawingPreviewService.backgroundColor.toRgbaString();
    }

    getFilter(): string {
        return `url(#previewFilter${this.drawingPreviewService.previewFilter})`;
    }
}
