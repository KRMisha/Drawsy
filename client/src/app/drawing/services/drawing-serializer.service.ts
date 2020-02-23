import { Injectable } from '@angular/core';
import { DrawingService } from './drawing.service';
import { Drawing } from '@app/classes/drawing';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})

export class DrawingSerializerService {

    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer) {}

    exportCurrentDrawing(): SafeUrl {
        const currentDrawing: Drawing = this.drawingService.getCurrentDrawing();
        const serializer = new XMLSerializer();
        let svgFile: string = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"> width=${this.drawingService.getDrawingDimensions().x} height=${this.drawingService.getDrawingDimensions().y}`;

        for (const element of currentDrawing.elements) {
            svgFile += serializer.serializeToString(element);
        }
        svgFile += '</svg>'
        const blob = new Blob([svgFile], {type: 'image/svg+xml'});

        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }

    importSelectedDrawing(file: FileList): void {
        // let importedDrawing: Drawing = new Drawing();
        const fileReader: FileReader = new FileReader();
        let fileContent: string = '';
        fileReader.onloadend = () => { 
            fileContent = (fileReader.result as string);
            console.log(fileContent);

            // const domParser = new DOMParser();
            // const doc = domParser.parseFromString(fileContent, 'image/svg+xml');
            // const penis = doc.getRootNode();
        }
        fileReader.readAsText(file[0]);

        // let svgDocument = document.body.firstChild;
        
        // this.drawingService.loadDrawing(importedDrawing);
    }
}
