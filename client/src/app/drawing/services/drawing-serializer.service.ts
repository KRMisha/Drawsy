import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Color } from '@app/classes/color';
import { Drawing } from '@app/classes/drawing';
import { DrawingService } from './drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSerializerService {
    constructor(private drawingService: DrawingService, private domSanitizer: DomSanitizer) {}

    exportCurrentDrawing(metaData: HTMLMetaElement[]): SafeUrl {
        this.drawingService.renderer.createElement('metadata', 'svg');
        const currentDrawing: Drawing = this.drawingService.getCurrentDrawing();
        const serializer = new XMLSerializer();
        const filterBackground = new Color();
        filterBackground.alpha = 0;
        let svgFile = '';
        // for (const metaElement of metaData) {
        //     svgFile += serializer.serializeToString(metaElement);
        // }
        svgFile += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"> width=${this.drawingService.getDrawingDimensions().x} height=${
            this.drawingService.getDrawingDimensions().y}`;

        svgFile += `<filter id="mid-sepia" color-interpolation-filters="sRGB">
        <feColorMatrix type="luminanceToAlpha"/>
        <feComponentTransfer >
          <feFuncA type="table" tableValues="0 .2 0.5 1 1 1 0.5 .2 0"/>
        </feComponentTransfer>
       <feComposite operator="in" in="SourceGraphic"/>
         <feColorMatrix type="matrix" result="sepia-clip"
        values="0.39 0.769 0.189 0  0 
                0.349 0.686 0.168 0  0  
                0.272 0.534 0.131 0  0 
                  0  0 0 1  0" />
      
        <feColorMatrix in="SourceGraphic" type="matrix" result="gscale"
                      values="0.2126 0.7152 0.0722 0 0 
                              0.2126 0.7152 0.0722 0 0 
                              0.2126 0.7152 0.0722 0 0 
                              0 0 0 1 0" />
        <feComposite operator="over" in="sepia-clip" in2="gscale"/>
      </filter>`
        // svgFile += `<meta>`
        // svgFile += serializer.serializeToString(this.metaData.addTag({ name: 'Test', content: 'this bish' }) as Node);
        for (const element of currentDrawing.svgElements) {
            svgFile += serializer.serializeToString(element);
        }
        svgFile += `<rect width="100%" height="100%" fill=${filterBackground.toRgbaString()} />`
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
                importedDrawing.addSvgElement(childrenArray[i] as SVGElement);
            }
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
