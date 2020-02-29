import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { DrawingService } from '@app/drawing/services/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer) {}

    exportCurrentDrawing(metaData: SVGMetadataElement[]): SafeUrl {
        // const currentDrawing: Drawing = this.drawingService.getCurrentDrawing();
        // const serializer = new XMLSerializer();

        let svgFile = '';
        // svgFile = serializer.serializeToString(this.drawingService.getDrawingRoot().innerHTML)
        // for (const metaElement of metaData) {
        //     svgFile += serializer.serializeToString(metaElement);
        // }
        svgFile += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"> width=${this.drawingService.getDrawingDimensions().x} height=${
            this.drawingService.getDrawingDimensions().y}`;
        // // svgFile += `<meta>`
        // // svgFile += serializer.serializeToString(this.metaData.addTag({ name: 'Test', content: 'this bish' }) as Node);
        // for (const element of currentDrawing.svgElements) {
        //     svgFile += serializer.serializeToString(element);
        // }
        svgFile += this.drawingService.getSvgRoot()[0].innerHTML;

        svgFile += '</svg>';
        const blob = new Blob([svgFile], { type: 'image/svg+xml' });

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

            Array.from(childrenArray).forEach( (element: SVGElement) => {
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
