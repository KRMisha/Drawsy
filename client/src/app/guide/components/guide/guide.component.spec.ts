import { ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GuideService } from '@app/guide/services/guide.service';
import { Subject } from 'rxjs';
import { GuideSidebarComponent } from '../guide-sidebar/guide-sidebar.component';

class FirstGuideNodeMock implements GuideContent {}
const firstGuideNodeMock: GuideNode = {
    name: 'FirstGuideNodeMock',
    guide: FirstGuideNodeMock,
    previousGuideNode: undefined,
    nextGuideNode: undefined,
};

describe('GuideComponent', () => {
    let component: GuideComponent;
    let guideSideBarSpyObj: jasmine.SpyObj<GuideSidebarComponent>;
    const currentGuideChangedSubject = new Subject<Type<GuideContent>>();
    let componentFactoryResolverSpyObj: jasmine.SpyObj<ComponentFactoryResolver>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;

    beforeEach(async(() => {
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', ['selectPreviousGuide', 'selectNextGuide'], {
            currentGuideChanged$: currentGuideChangedSubject,
        });

        guideSideBarSpyObj = jasmine.createSpyObj('GuideSideBar', ['expandAllMenus']);

        componentFactoryResolverSpyObj = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
        TestBed.configureTestingModule({
            declarations: [GuideComponent],
            imports: [MatIconModule, MatDialogModule],
            providers: [{ provide: GuideService, useValue: guideServiceSpyObj }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.sidebar = guideSideBarSpyObj;
        component['guideService'] = guideServiceSpyObj; // tslint:disable-line: no-string-literal
        component['componentFactoryResolver'] = componentFactoryResolverSpyObj; // tslint:disable-line: no-string-literal
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngAfterViewInit should subscribe to the currentGuidechanged observable of guideService', () => {
        const loadGuideSpy = spyOn<any>(component, 'loadGuide').and.callThrough(); // tslint:disable-line: no-any
        component.ngAfterViewInit();
        const passedGuide = firstGuideNodeMock.guide!; // tslint:disable-line: no-non-null-assertion

        const componentFactoryStub = {} as ComponentFactory<GuideContent>;
        componentFactoryResolverSpyObj.resolveComponentFactory.and.returnValue(componentFactoryStub);
        const changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        const componentRefSpyObj = jasmine.createSpyObj('ComponentRef<GuideContent>', [], { changeDetectorRef: changeDetectorRefSpyObj });
        spyOn(component.guideContent, 'createComponent').and.returnValue(componentRefSpyObj);

        currentGuideChangedSubject.next(passedGuide);
        expect(loadGuideSpy).toHaveBeenCalledWith(passedGuide);

        expect(component.guideContent.createComponent).toHaveBeenCalledWith(componentFactoryStub);
        expect(changeDetectorRefSpyObj.detectChanges).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from currentGuideChangedSubscription', () => {
        // tslint:disable-next-line: no-string-literal no-any
        const subscriptionSpy = spyOn<any>(component['currentGuideChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(subscriptionSpy).toHaveBeenCalled();
    });

    it('#selectPreviousGuide should forward the call to guideService', () => {
        component.selectPreviousGuide();
        expect(guideServiceSpyObj.selectPreviousGuide).toHaveBeenCalled();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
    });

    it('#selectNextGuide should forward the call to the guideService', () => {
        component.selectNextGuide();
        expect(guideServiceSpyObj.selectNextGuide).toHaveBeenCalled();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
    });
});
