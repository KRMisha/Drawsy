import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingPreviewService {
    drawingPreviewRoot: SVGSVGElement;
    svgTitle: SVGTitleElement;
    svgDesc: SVGDescElement;
    svgDefs: SVGDefsElement;
    svgDrawingContent: SVGGElement;

    drawingFilter = DrawingFilter.None;

    private renderer: Renderer2;

    constructor(private rendererFactory: RendererFactory2, private drawingService: DrawingService) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    initializePreview(): void {
        const viewBoxString = `0 0 ${this.drawingService.dimensions.x} ${this.drawingService.dimensions.y}`;
        this.renderer.setAttribute(this.drawingPreviewRoot, 'viewBox', viewBoxString);

        for (const filter of Array.from(this.drawingService.drawingRoot.getElementsByTagName('defs')[0].children)) {
            this.renderer.appendChild(this.svgDefs, filter.cloneNode(true));
        }

        for (const element of this.drawingService.svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element.cloneNode(true));
        }
    }

    finalizePreview(): void {
        const titleText = this.renderer.createText(this.drawingService.title);
        this.renderer.appendChild(this.svgTitle, titleText);

        const labelsText = this.renderer.createText(this.drawingService.labels.join());
        this.renderer.appendChild(this.svgDesc, labelsText);
    }

    get backgroundColor(): Color {
        return this.drawingService.backgroundColor;
    }

    get id(): string | undefined {
        return this.drawingService.id;
    }
    set id(id: string | undefined) {
        this.drawingService.id = id;
    }

    get title(): string {
        return this.drawingService.title;
    }
    set title(title: string) {
        this.drawingService.title = title;
    }

    get labels(): string[] {
        return this.drawingService.labels;
    }
    set labels(labels: string[]) {
        this.drawingService.labels = labels;
    }
}
