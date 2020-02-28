import { ViewContainerRef } from '@angular/core';
import { GuideDirective } from '@app/guide/components/guide-directive/guide.directive';

describe('GuideDirective', () => {
    it('should create an instance', () => {
        const directive = new GuideDirective({} as ViewContainerRef);
        expect(directive).toBeTruthy();
    });
});
