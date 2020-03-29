import { DomSanitizer } from '@angular/platform-browser';
import { GalleryPreviewPipe } from '@app/shared/pipes/gallery-preview.pipe';

describe('GalleryPreviewPipe', () => {
    let domSanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;
    let pipe: GalleryPreviewPipe;

    beforeEach(() => {
        domSanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
        pipe = new GalleryPreviewPipe(domSanitizerSpyObj);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('GalleryPreviewPipe should use DomSanitizer to bypassSecurityTrust because the string will be from a trusted source', () => {
        const passedValue = 'TestString';
        pipe.transform(passedValue);
        expect(domSanitizerSpyObj.bypassSecurityTrustHtml).toHaveBeenCalledWith(passedValue);
    });
});
