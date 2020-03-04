import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Color } from '@app/classes/color';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(
        private domSanitizer: DomSanitizer,
        private drawingService: DrawingService,
        private drawingPreviewService: DrawingPreviewService,
    ) {}

    exportSvgDrawing(): SafeUrl {
        this.drawingPreviewService.finalizePreview();

        const xmlHeader = '<?xml version="1.0" standalone="yes"?>\n';
        const content = xmlHeader + this.drawingPreviewService.drawingPreviewRoot.outerHTML;
        const blob = new Blob([content], { type: 'image/svg+xml' });

        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }

    importSvgDrawing(file: File): void {
        const fileReader: FileReader = new FileReader();
        fileReader.readAsText(file);

        const domParser = new DOMParser();
        const document = domParser.parseFromString(fileReader.result as string, 'image/svg+xml');
        const drawingRoot = document.getElementsByTagName('svg')[0];

        this.drawingService.dimensions.x = drawingRoot.viewBox.baseVal.width;
        this.drawingService.dimensions.y = drawingRoot.viewBox.baseVal.height;

        const backgroundRectFill = drawingRoot.getElementsByTagName('rect')[0].getAttribute('fill') as string;
        const rgbaRegex = `/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/`;
        const radix = 10;
        const rgba = (backgroundRectFill.match(rgbaRegex) as RegExpMatchArray).map((x: string) => parseInt(x, radix));
        this.drawingService.backgroundColor = Color.fromRgba.apply(rgba);

        this.drawingService.title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
        this.drawingService.labels = drawingRoot.getElementsByTagName('desc')[0].innerHTML.split(',');

        const svgDrawingContent = drawingRoot.getElementsByTagName('g')[0];
        for (const element of Array.from(svgDrawingContent.children)) {
            this.drawingService.addElement(element as SVGElement);
        }
    }
}
