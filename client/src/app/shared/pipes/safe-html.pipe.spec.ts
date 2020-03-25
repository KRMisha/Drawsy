import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';

describe('SafeHtmlPipe', () => {
    let domSanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;
    let pipe: SafeHtmlPipe;

    beforeEach(() => {
        domSanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
        pipe = new SafeHtmlPipe(domSanitizerSpyObj);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('SafeHtmlPipe should use DomSanitizer to bypassSecurityTrust because the string will be from a trusted source', () => {
        const passedValue = 'TestString';
        pipe.transform(passedValue);
        expect(domSanitizerSpyObj.bypassSecurityTrustHtml).toHaveBeenCalledWith(passedValue);
    });
});
