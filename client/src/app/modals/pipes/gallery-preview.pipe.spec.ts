import { DomSanitizer } from '@angular/platform-browser';
import { GalleryPreviewPipe } from '@app/modals/pipes/gallery-preview.pipe';

describe('GalleryPreviewPipe', () => {
    let domSanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;
    let pipe: GalleryPreviewPipe;
    let svgElementSpyObj: jasmine.SpyObj<SVGSVGElement>;
    const outerHtmlContent = 'This is not a joke';
    beforeEach(() => {
        svgElementSpyObj = jasmine.createSpyObj('SVGSVGElement', ['setAttribute'], { outerHTML: outerHtmlContent });
        domSanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
        pipe = new GalleryPreviewPipe(domSanitizerSpyObj);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should bypassHtml security and return safe svg outerHTML', () => {
        pipe.transform(svgElementSpyObj);
        expect(domSanitizerSpyObj.bypassSecurityTrustHtml).toHaveBeenCalledWith(outerHtmlContent);
        expect(svgElementSpyObj.setAttribute).toHaveBeenCalledWith('preserveAspectRatio', 'xMidYMid slice');
    });
});
