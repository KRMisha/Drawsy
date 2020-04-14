import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'galleryPreview',
})
export class GalleryPreviewPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(drawingRoot: SVGSVGElement): SafeHtml {
        drawingRoot.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        return this.sanitizer.bypassSecurityTrustHtml(drawingRoot.outerHTML);
    }
}
