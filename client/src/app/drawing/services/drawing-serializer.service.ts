import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { Label } from '@app/drawing/components/export-drawing/export-drawing/export-drawing.component';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer) {}

    exportCurrentDrawing(labels: Label[]): SafeUrl {
        const svgFileString = this.drawingService.getDrawingRoot().outerHTML;
        const blob = new Blob([svgFileString], { type: 'image/svg+xml' });

        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }

    importSelectedDrawing(file: FileList): void {
        const importedDrawing: Drawing = new Drawing();
        const fileReader: FileReader = new FileReader();
        let fileContent: string;

        fileReader.onloadend = () => {
            fileContent = fileReader.result as string;

            const domParser = new DOMParser();
            const doc = domParser.parseFromString(fileContent, 'image/svg+xml');
            const childrenArray = doc.children[0].getElementsByTagName('g');

            Array.from(childrenArray).forEach((element: SVGElement) => {
                importedDrawing.addSvgElement(element);
            });

            const backgroundColor = new Color();
            backgroundColor.red = Color.maxRgb;
            backgroundColor.green = Color.maxRgb;
            backgroundColor.blue = Color.maxRgb;

            importedDrawing.backgroundColor = backgroundColor;
            this.drawingService.setDrawing(importedDrawing);
        };

        fileReader.readAsText(file[0]);
    }
}
