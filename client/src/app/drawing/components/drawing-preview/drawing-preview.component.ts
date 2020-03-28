import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-drawing-preview',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './drawing-preview.component.html',
    styleUrls: ['./drawing-preview.component.scss'],
})
export class DrawingPreviewComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appDrawingRoot') private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appTitle') private svgTitle: ElementRef<SVGTitleElement>;
    @ViewChild('appDesc') private svgDesc: ElementRef<SVGDescElement>;
    @ViewChild('appDefs') private svgDefs: ElementRef<SVGDefsElement>;
    @ViewChild('appDrawingContent') private svgDrawingContent: ElementRef<SVGGElement>;

    constructor(private drawingService: DrawingService, private drawingPreviewService: DrawingPreviewService) {
        this.drawingPreviewService.drawingFilter = DrawingFilter.None;
    }

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

    get backgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }

    get drawingFilter(): string | null{
        return this.drawingPreviewService.drawingFilter === DrawingFilter.None
            ? null
            : `url(#drawingFilter${this.drawingPreviewService.drawingFilter})`;
    }
}
