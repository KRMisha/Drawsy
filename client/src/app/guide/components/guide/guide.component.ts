import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';
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
    currentComponent: string;
    @ViewChild('appSidebar') sidebar: GuideSidebarComponent;
    @ViewChild('appGuideContent', { read: ViewContainerRef }) guideContent: ViewContainerRef;

    constructor(private guideService: GuideService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.guides = this.guideService.getGuides();
        this.currentComponent = 'GuideWelcomeComponent';
        this.selectedGuideIndex = 0;
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

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(guide);
        this.guideContent.clear();
        this.guideContent.createComponent(componentFactory);

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

    get hasPreviousGuide(): boolean {
        return this.selectedGuideIndex > 0;
    }

    get hasNextGuide(): boolean {
        return this.selectedGuideIndex < this.guides.length - 1;
    }
}
