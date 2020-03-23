import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { GuideService } from '@app/guide/services/guide.service';
import { GuideSidebarComponent } from '../guide-sidebar/guide-sidebar.component';

class FirstGuideNodeMock implements GuideContent {}
class SecondGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file

const firstGuideNodeMock: GuideNode = {
    name: 'FirstGuideNodeMock',
    guide: FirstGuideNodeMock,
    previousGuideNode: undefined,
    nextGuideNode: SecondGuideNodeMock,
};

const secondGuideNodeMock: GuideNode = {
    name: 'SecondGuideNodeMock',
    guide: SecondGuideNodeMock,
    previousGuideNode: FirstGuideNodeMock,
    nextGuideNode: undefined,
};

fdescribe('GuideComponent', () => {
    let component: GuideComponent;
    let fixture: ComponentFixture<GuideComponent>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;
    let guideSideBarSpyObj: jasmine.SpyObj<GuideSidebarComponent>;

    beforeEach(async(() => {
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', [], [{ currentGuideNode: firstGuideNodeMock }]);

        guideSideBarSpyObj = jasmine.createSpyObj('GuideSideBar', ['expandAllMenus']);

        TestBed.configureTestingModule({
            declarations: [GuideComponent],
            imports: [MatIconModule, MatDialogModule],
            providers: [{ provide: GuideService, useValue: guideServiceSpyObj }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        component.sidebar = guideSideBarSpyObj;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngAfterViewInit should subscribe to the currentGuidechanged observable of guideService', () => {
        // component.ngAfterViewInit();
        // // tslint:disable-next-line: no-string-literal deprecation
        // expect(observableSpyObj.subscribe).toHaveBeenCalledWith(component['loadGuide'].bind(component));
    });

    it('#ngOnDestroy should unsubscribe from currentGuideChangedSubscription', () => {
        spyOn(component.currentGuideChangedSubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.currentGuideChangedSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('#selectPreviousGuide should update the guide of guideService if the previous guide is not undefined', () => {
        guideServiceSpyObj.currentGuideNode = secondGuideNodeMock;
        component.selectPreviousGuide();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
        expect(guideServiceSpyObj.currentGuideNode).toEqual(firstGuideNodeMock);
    });

    it('#selectPreviousGuide should not update the guide of guideService if the previous guide is undefined', () => {
        guideServiceSpyObj.currentGuideNode = firstGuideNodeMock;
        component.selectPreviousGuide();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
        expect(guideServiceSpyObj.currentGuideNode).toEqual(firstGuideNodeMock);
    });

    it('#selectNextGuide should update the current guide of guideService if the next guide is not undefined', () => {
        guideServiceSpyObj.currentGuideNode = firstGuideNodeMock;
        component.selectPreviousGuide();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
        expect(guideServiceSpyObj.currentGuideNode).toEqual(secondGuideNodeMock);
    });

    it('#selectNextGuide should not update the current guide of guideService if the next guide is undefined', () => {
        guideServiceSpyObj.currentGuideNode = secondGuideNodeMock;
        component.selectPreviousGuide();
        expect(guideSideBarSpyObj.expandAllMenus).toHaveBeenCalled();
        expect(guideServiceSpyObj.currentGuideNode).toEqual(secondGuideNodeMock);
    });
});
