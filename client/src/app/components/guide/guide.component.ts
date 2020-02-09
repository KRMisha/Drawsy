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
    index: number;
    hasPreviousGuide: boolean;
    hasNextGuide: boolean;
    @ViewChild(GuideDirective, { static: false }) guideHost: GuideDirective;

    constructor(private guideService: GuideService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.guides = this.guideService.getGuides();
        this.index = 0;
        this.hasPreviousGuide = false;
        this.hasNextGuide = true;
    }

    ngAfterViewInit() {
        this.selectGuide(this.index);
    }

    updateIndex(newIndex: number) {
        this.index = newIndex;
        this.hasNextGuide = this.index < this.guides.length - 1;
        this.hasPreviousGuide = this.index > 0;
    }

    selectGuide(index: number) {
        this.updateIndex(index);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.guides[this.index]);

        const viewContainerRef = this.guideHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
    }

    selectNextGuide(): void {
        if (this.hasNextGuide) {
            this.selectGuide(++this.index);
            this.guideService.openAllCollapseMenus();
        }
    }

    selectPreviousGuide(): void {
        if (this.hasPreviousGuide) {
            this.selectGuide(--this.index);
            this.guideService.openAllCollapseMenus();
        }
    }
}
