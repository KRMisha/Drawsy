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

    ngOnInit(): void {
        this.guides = this.guideService.getGuides();
        this.selectedGuideIndex = 0;
        this.hasPreviousGuide = false;
        this.hasNextGuide = true;
    }

    ngAfterViewInit(): void {
        this.selectGuide(this.guides[this.selectedGuideIndex]);
    }

    // tslint:disable-next-line: no-any
    selectGuide(guide: Type<any>): void {
        if (this.findIndex(guide) === -1) {
            return;
        }

        this.selectedGuideIndex = this.findIndex(guide);
        this.hasNextGuide = this.selectedGuideIndex < this.guides.length - 1;
        this.hasPreviousGuide = this.selectedGuideIndex > 0;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(guide);

        const viewContainerRef = this.guideHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
    }

    // tslint:disable-next-line: no-any
    findIndex(guide: Type<any>): number {
        for (let i = 0; i < this.guides.length; i++) {
            if (guide === this.guides[i]) {
                return i;
            }
        }
        return -1;
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
