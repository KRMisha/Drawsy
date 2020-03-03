import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Drawing } from '@app/classes/drawing';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer) {}

    exportCurrentDrawing(drawingRoot: SVGSVGElement): SafeUrl {
        const blob = new Blob([drawingRoot.outerHTML], { type: 'image/svg+xml' });

        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }

    importSelectedDrawing(file: FileList, svgRootElement: SVGSVGElement): void {
        const fileReader: FileReader = new FileReader();

        fileReader.onloadend = () => {
            const fileContent = fileReader.result as string;

            const domParser = new DOMParser();
            const doc = domParser.parseFromString(fileContent, 'image/svg+xml');

            const svgBackgroundRect = doc.children[0].getElementsByTagName('rect')[0];
            svgRootElement.getElementsByTagName('rect')[0].remove();
            svgRootElement.append(svgBackgroundRect);

            const svgDrawingContent = doc.children[0].getElementsByTagName('g')[0];
            svgRootElement.getElementsByTagName('g')[0].remove();
            svgRootElement.append(svgDrawingContent);

            const importedDrawing: Drawing = new Drawing();

            const svgMetadata = doc.children[0].getElementsByTagName('desc')[0];
            importedDrawing.title = svgMetadata.getElementsByTagName('title')[0].innerHTML;
            const labelString = svgMetadata.getElementsByTagName('desc')[0].innerHTML;

            const labels = labelString.split(',');
            for (const label of labels) {
                if (label.trim()) {
                    importedDrawing.addDescElement(label.trim());
                }
            }

            this.drawingService.setDrawing(importedDrawing);
        };
        fileReader.readAsText(file[0]);
    }
}
