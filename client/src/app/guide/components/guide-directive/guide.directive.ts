import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appGuide]',
})
export class GuideDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
