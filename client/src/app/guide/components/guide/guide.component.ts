import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, Type, ViewChild } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideDirective } from '@app/guide/components/guide-directive/guide.directive';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideService } from '@app/guide/services/guide.service';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss'],
})
export class GuideComponent implements OnInit, AfterViewInit {
    guides: Type<GuideContent>[];
    selectedGuideIndex: number;
    hasPreviousGuide: boolean;
    hasNextGuide: boolean;
    currentComponent: string;
    @ViewChild('appSidebar', { static: false }) sidebar: GuideSidebarComponent;
    @ViewChild(GuideDirective, { static: false }) guideHost: GuideDirective;

    constructor(private guideService: GuideService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.guides = this.guideService.getGuides();
        this.currentComponent = 'GuideWelcomeComponent';
        this.selectedGuideIndex = 0;
        this.hasPreviousGuide = false;
        this.hasNextGuide = true;
    }

    ngAfterViewInit(): void {
        this.selectGuide(this.guides[this.selectedGuideIndex]);
    }

    selectGuide(guide: Type<GuideContent>): void {
        const selectedGuideIndex = this.guides.indexOf(guide);
        if (selectedGuideIndex === -1) {
            return;
        }

        this.selectedGuideIndex = selectedGuideIndex;
        this.hasNextGuide = this.selectedGuideIndex < this.guides.length - 1;
        this.hasPreviousGuide = this.selectedGuideIndex > 0;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(guide);

        const viewContainerRef = this.guideHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
        this.currentComponent = guide.name;
    }

    selectNextGuide(): void {
        if (this.hasNextGuide) {
            this.selectGuide(this.guides[++this.selectedGuideIndex]);
        }
        this.sidebar.expandAllMenus();
    }

    selectPreviousGuide(): void {
        if (this.hasPreviousGuide) {
            this.selectGuide(this.guides[--this.selectedGuideIndex]);
        }
        this.sidebar.expandAllMenus();
    }
}
