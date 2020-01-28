import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, Type, ViewChild } from '@angular/core';

import { GuideService } from '../../services/guide/guide.service';
import { GuideDirective } from './guide-directive/guide.directive';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss'],
})
export class GuideComponent implements OnInit, AfterViewInit {
    guides: Type<any>[];
    @ViewChild(GuideDirective, { static: false }) guideHost: GuideDirective;

    constructor(private guideService: GuideService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.guides = this.guideService.getGuides();
    }

    ngAfterViewInit() {
        this.selectGuide(0);
    }

    selectGuide(index: number) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.guides[index]);

        const viewContainerRef = this.guideHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
    }
}
