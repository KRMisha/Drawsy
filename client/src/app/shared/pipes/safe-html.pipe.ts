import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(svgRoot: SVGSVGElement): SafeHtml {
        // svgRoot.setAttribute('height', '350px');
        // svgRoot.removeAttribute('width');
        svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        // svgRoot.style.display = 'block';

        return this.sanitizer.bypassSecurityTrustHtml(svgRoot.outerHTML);
    }
}
