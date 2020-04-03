import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Component({
    selector: 'app-drawing-preview',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './drawing-preview.component.html',
    styleUrls: ['./drawing-preview.component.scss'],
})
export class DrawingPreviewComponent implements AfterViewInit {
    @ViewChild('appDrawingRoot') drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appDefs') private svgDefs: ElementRef<SVGDefsElement>;
    @ViewChild('appDrawingContent') private svgDrawingContent: ElementRef<SVGGElement>;

    constructor(private renderer: Renderer2, private drawingPreviewService: DrawingPreviewService, private drawingService: DrawingService) {
        this.drawingPreviewService.drawingFilter = DrawingFilter.None;
    }

    ngAfterViewInit(): void {
        for (const filter of Array.from(this.drawingService.drawingRoot.getElementsByTagName('defs')[0].getElementsByTagName('filter'))) {
            this.renderer.appendChild(this.svgDefs.nativeElement, filter.cloneNode(true));
        }

        for (const element of this.drawingService.svgElements) {
            this.renderer.appendChild(this.svgDrawingContent.nativeElement, element.cloneNode(true));
        }
    }

    get viewBox(): string {
        return `0 0 ${this.drawingService.dimensions.x} ${this.drawingService.dimensions.y}`;
    }

    get drawingTitle(): string {
        return this.drawingService.title;
    }

    get drawingLabels(): string {
        return this.drawingService.labels.join(',');
    }

    get backgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }

    get drawingFilter(): string | null {
        return this.drawingPreviewService.drawingFilter === DrawingFilter.None
            ? null
            : `url(#drawingFilter${this.drawingPreviewService.drawingFilter})`;
    }
}
