import { Injectable, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { DrawingService } from './drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer, private renderer: Renderer2) {}

    exportCurrentDrawing(metaData: HTMLMetaElement[]): SafeUrl {
        this.renderer.createElement('metadata');
        const currentDrawing: Drawing = this.drawingService.getCurrentDrawing();
        const serializer = new XMLSerializer();
        let svgFile = '';
        // for (const metaElement of metaData) {
        //     svgFile += serializer.serializeToString(metaElement);
        // }
        svgFile += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"> width=${this.drawingService.getDrawingDimensions().x} height=${
            this.drawingService.getDrawingDimensions().y
        }`;
        // svgFile += `<meta>`
        // svgFile += serializer.serializeToString(this.metaData.addTag({ name: 'Test', content: 'this bish' }) as Node);
        for (const element of currentDrawing.elements) {
            svgFile += serializer.serializeToString(element);
        }
        svgFile += '</svg>';
        const blob = new Blob([svgFile], { type: 'image/svg+xml' });

        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }

    importSelectedDrawing(file: FileList): void {
        let importedDrawing: Drawing = new Drawing();
        const fileReader: FileReader = new FileReader();
        let fileContent: string = '';
        fileReader.onloadend = () => {
            fileContent = fileReader.result as string;

            const domParser = new DOMParser();
            const doc = domParser.parseFromString(fileContent, 'image/svg+xml');
            let childrenArray = doc.children;
            for (let i = 0; i < childrenArray.length; i++) {
                console.log('FIRST DEGREE CHILD');
                console.log(childrenArray[i]);
            }
            childrenArray = childrenArray[0].children;
            // console.log(doc);
            // console.log("BETWEEEENNNNNN");
            // console.log(Array.prototype.slice.call(doc.children));
            for (let i = 0; i < childrenArray.length; i++) {
                importedDrawing.addElement(childrenArray[i] as SVGElement);
            }
            const backgroundColor = new Color();
            backgroundColor.red = Color.maxRgb;
            backgroundColor.green = Color.maxRgb;
            backgroundColor.blue = Color.maxRgb;

            importedDrawing.backgroundColor = backgroundColor;
            this.drawingService.loadDrawing(importedDrawing);
        };
        fileReader.readAsText(file[0]);
    }
}
