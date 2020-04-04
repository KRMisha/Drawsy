import { ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GuideService } from '@app/guide/services/guide.service';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal

class FirstGuideContentMock implements GuideContent {}
const firstGuideNodeMock: GuideNode = {
    name: 'FirstGuideNodeMock',
    guide: FirstGuideContentMock,
    previousGuideNode: undefined,
    nextGuideNode: undefined,
};

describe('GuideComponent', () => {
    let component: GuideComponent;
    let currentGuideChangedSubject: Subject<Type<GuideContent>>;
    let guideSidebarSpyObj: jasmine.SpyObj<GuideSidebarComponent>;
    let componentFactoryResolverSpyObj: jasmine.SpyObj<ComponentFactoryResolver>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;

    beforeEach(async(() => {
        guideSidebarSpyObj = jasmine.createSpyObj('GuideSideBar', ['expandAllMenus']);
        componentFactoryResolverSpyObj = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
        currentGuideChangedSubject = new Subject<Type<GuideContent>>();
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', ['selectPreviousGuide', 'selectNextGuide'], {
            currentGuideChanged$: currentGuideChangedSubject,
        });

        TestBed.configureTestingModule({
            declarations: [GuideComponent],
            providers: [{ provide: GuideService, useValue: guideServiceSpyObj }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        const fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['sidebar'] = guideSidebarSpyObj;
        component['guideService'] = guideServiceSpyObj;
        component['componentFactoryResolver'] = componentFactoryResolverSpyObj;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngAfterViewInit should subscribe to the currentGuidechanged observable of guideService', async(() => {
        const loadGuideSpy = spyOn<any>(component, 'loadGuide').and.callThrough(); // tslint:disable-line: no-any
        component.ngAfterViewInit();
        const passedGuide = firstGuideNodeMock.guide!; // tslint:disable-line: no-non-null-assertion

        const componentFactoryStub = {} as ComponentFactory<GuideContent>;
        componentFactoryResolverSpyObj.resolveComponentFactory.and.returnValue(componentFactoryStub);
        const changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        const componentRefSpyObj = jasmine.createSpyObj('ComponentRef<GuideContent>', [], { changeDetectorRef: changeDetectorRefSpyObj });
        spyOn(component['guideContent'], 'createComponent').and.returnValue(componentRefSpyObj);

        currentGuideChangedSubject.next(passedGuide);
        expect(loadGuideSpy).toHaveBeenCalledWith(passedGuide);
        expect(component['guideContent'].createComponent).toHaveBeenCalledWith(componentFactoryStub);
        expect(changeDetectorRefSpyObj.detectChanges).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from currentGuideChangedSubscription', () => {
        const subscriptionSpy = spyOn<any>(component['currentGuideChangedSubscription'], 'unsubscribe'); // tslint:disable-line: no-any
        component.ngOnDestroy();
        expect(subscriptionSpy).toHaveBeenCalled();
    });

    it('#selectPreviousGuide should forward the call to guideService', () => {
        component.selectPreviousGuide();
        expect(guideServiceSpyObj.selectPreviousGuide).toHaveBeenCalled();
        expect(guideSidebarSpyObj.expandAllMenus).toHaveBeenCalled();
    });

    it('#selectNextGuide should forward the call to the guideService', () => {
        component.selectNextGuide();
        expect(guideServiceSpyObj.selectNextGuide).toHaveBeenCalled();
        expect(guideSidebarSpyObj.expandAllMenus).toHaveBeenCalled();
    });
});
