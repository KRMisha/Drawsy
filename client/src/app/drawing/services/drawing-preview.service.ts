import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { PreviewFilter } from '@app/drawing/enums/preview-filter.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingPreviewService {
    private renderer: Renderer2;

    private _drawingPreviewRoot: SVGSVGElement; // tslint:disable-line: variable-name
    get drawingPreviewRoot(): SVGSVGElement {
        return this._drawingPreviewRoot;
    }

    private svgTitle: SVGTitleElement;
    private svgDesc: SVGDescElement;
    private svgDefs: SVGDefsElement;
    private svgDrawingContent: SVGGElement;

    previewFilter = PreviewFilter.None;

    constructor(private rendererFactory: RendererFactory2, private drawingService: DrawingService) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    setTarget(drawingPreviewRoot: SVGSVGElement): void {
        this._drawingPreviewRoot = drawingPreviewRoot;
        this.svgTitle = this.drawingPreviewRoot.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'title')[0];
        this.svgDesc = this.drawingPreviewRoot.getElementsByTagName('desc')[0];
        this.svgDefs = this.drawingPreviewRoot.getElementsByTagName('defs')[0];
        this.svgDrawingContent = this.drawingPreviewRoot.getElementsByTagName('g')[0];
    }

    initializePreview(): void {
        const viewBoxString = `0 0 ${this.drawingService.dimensions.x} ${this.drawingService.dimensions.y}`;
        this.renderer.setAttribute(this.drawingPreviewRoot, 'viewBox', viewBoxString);

        for (const filter of Array.from(this.drawingService.drawingRoot.getElementsByTagName('defs')[0].children)) {
            this.renderer.appendChild(this.svgDefs, filter);
        }

        for (const element of this.drawingService.svgElements) {
            this.renderer.appendChild(this.svgDrawingContent, element);
        }
    }

    finalizePreview(): void {
        const titleText = this.renderer.createText(this.drawingService.title);
        this.renderer.appendChild(this.svgTitle, titleText);

        const labelsText = this.renderer.createText(this.drawingService.labels.join());
        this.renderer.appendChild(this.svgDesc, labelsText);
    }

    getBackgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
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
