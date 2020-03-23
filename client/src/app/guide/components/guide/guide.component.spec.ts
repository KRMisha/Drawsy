import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GuideContent } from '@app/guide/classes/guide-content';
// import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GuideService } from '@app/guide/services/guide.service';
import { Subject } from 'rxjs';
import { GuideSidebarComponent } from '../guide-sidebar/guide-sidebar.component';

fdescribe('GuideComponent', () => {
    let component: GuideComponent;
    let fixture: ComponentFixture<GuideComponent>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;
    let guideSideBarSpyObj: jasmine.SpyObj<GuideSidebarComponent>;
    // tslint:disable-next-line: no-non-null-assertion
    const currentGuideChangedSubject = new Subject<Type<GuideContent>>();

    beforeEach(async(() => {
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', [
            'selectPreviousGuide',
            'selectNextGuide',
        ], {
            currentGuideChanged$: currentGuideChangedSubject.asObservable()
        });

        guideSideBarSpyObj = jasmine.createSpyObj('GuideSideBar', ['expandAllMenus']);

        TestBed.configureTestingModule({
            declarations: [GuideComponent],
            imports: [MatIconModule, MatDialogModule],
            providers: [
                { provide: GuideService, useValue: guideServiceSpyObj }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.sidebar = guideSideBarSpyObj;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('#ngAfterViewInit should subscribe to the currentGuidechanged observable of guideService', () => {
        // Confirm with Will wtf is going on
        // const loadGuideSpy = spyOn<any>(component, 'loadGuide'); // tslint:disable-line: no-any
        // component.ngAfterViewInit();
        // currentGuideChangedSubject.next(firstGuideNodeMock.guide!); // tslint:disable-line: no-non-null-assertion
        // expect(loadGuideSpy).toHaveBeenCalled();
    // });

    it('#ngOnDestroy should unsubscribe from currentGuideChangedSubscription', () => {
        spyOn(component.currentGuideChangedSubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.currentGuideChangedSubscription.unsubscribe).toHaveBeenCalled();
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
