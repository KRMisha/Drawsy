import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, Type, ViewChild } from '@angular/core';
import { GuideService } from '../../services/guide.service';
import { GuideDirective } from '../guide-directive/guide.directive';
import { GuideSidebarComponent } from '../guide-sidebar/guide-sidebar.component';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss'],
})
export class GuideComponent implements OnInit, AfterViewInit {
    guides: Type<any>[]; // tslint:disable-line: no-any
    selectedGuideIndex: number;
    hasPreviousGuide: boolean;
    hasNextGuide: boolean;
    @ViewChild('sidebar', { static: false }) sidebar: GuideSidebarComponent;
    @ViewChild(GuideDirective, { static: false }) guideHost: GuideDirective;

    constructor(private guideService: GuideService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.guides = this.guideService.getGuides();
        this.selectedGuideIndex = 0;
        this.hasPreviousGuide = false;
        this.hasNextGuide = true;
    }

    ngAfterViewInit() {
        this.selectGuide(this.selectedGuideIndex);
    }

    selectGuide(index: number) {
        if (index < 0 || index > this.guides.length) {
            return;
        }

        this.selectedGuideIndex = index;
        this.hasNextGuide = this.selectedGuideIndex < this.guides.length - 1;
        this.hasPreviousGuide = this.selectedGuideIndex > 0;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.guides[this.selectedGuideIndex]);

        const viewContainerRef = this.guideHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
    }

    selectNextGuide(): void {
        if (this.hasNextGuide) {
            this.selectGuide(++this.selectedGuideIndex);
        }
        this.sidebar.expandAllMenus();
    }

    selectPreviousGuide(): void {
        if (this.hasPreviousGuide) {
            this.selectGuide(--this.selectedGuideIndex);
        }
        this.sidebar.expandAllMenus();
    }
}
