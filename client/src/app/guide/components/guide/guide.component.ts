import { AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideService } from '@app/guide/services/guide.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss'],
    providers: [GuideService],
})
export class GuideComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appSidebar') private sidebar: GuideSidebarComponent;
    @ViewChild('appGuideContent', { read: ViewContainerRef })
    private guideContent: ViewContainerRef;

    private currentGuideChangedSubscription: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private guideService: GuideService
    ) {}

    ngAfterViewInit(): void {
        this.currentGuideChangedSubscription = this.guideService.currentGuideChanged$.subscribe(this.loadGuide.bind(this));
    }

    ngOnDestroy(): void {
        this.currentGuideChangedSubscription.unsubscribe();
    }

    selectPreviousGuide(): void {
        this.guideService.selectPreviousGuide();
        this.sidebar.expandAllMenus();
    }

    selectNextGuide(): void {
        this.guideService.selectNextGuide();
        this.sidebar.expandAllMenus();
    }

    get hasPreviousGuide(): boolean {
        return this.guideService.currentGuideNode.previousGuideNode !== undefined;
    }

    get hasNextGuide(): boolean {
        return this.guideService.currentGuideNode.nextGuideNode !== undefined;
    }

    private loadGuide(guide: Type<GuideContent>): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(guide);
        this.guideContent.clear();
        const componentRef = this.guideContent.createComponent(componentFactory);
        componentRef.changeDetectorRef.detectChanges();
    }
}
