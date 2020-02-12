import { Component, CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { GuideService } from '../../services/guide/guide.service';
import { GuideDirective } from './guide-directive/guide.directive';
import { GuideSidebarComponent } from './guide-sidebar/guide-sidebar.component';
import { GuideComponent } from './guide.component';

@Component({
    selector: 'app-guide-welcome',
    template: '<p>Mock Welcome Guide</p>',
})
class MockGuideWelcomeComponent {}

describe('GuideComponent', () => {
    const mockGuides: Type<any>[] = [MockGuideWelcomeComponent, MockGuideWelcomeComponent];
    let component: GuideComponent;
    let fixture: ComponentFixture<GuideComponent>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GuideComponent>>;

    beforeEach(async(() => {
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });

        const guideServiceSpyObj = jasmine.createSpyObj({ getGuides: mockGuides });

        TestBed.configureTestingModule({
            declarations: [GuideComponent, MockGuideWelcomeComponent, GuideDirective],
            imports: [MatIconModule, MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpyObj },
                { provide: GuideService, useValue: guideServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [MockGuideWelcomeComponent] } })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should initialise attributes to default value and get guides from service', () => {
        component.ngOnInit();
        expect(component.guides).toEqual(mockGuides);
        expect(component.selectedGuideIndex).toEqual(0);
        expect(component.hasPreviousGuide).toEqual(false);
        expect(component.hasNextGuide).toEqual(true);
    });

    it('#ngAfterViewInit should select the guide depending on the index attribute', () => {
        spyOn(component, 'selectGuide');

        component.ngAfterViewInit();
        expect(component.selectGuide).toHaveBeenCalled();
    });

    it('#selectGuide should check if index is in range of guides array', () => {
        component.selectedGuideIndex = 1;
        component.selectGuide(4);
        expect(component.selectedGuideIndex).toEqual(1);
        component.selectGuide(-1);
        expect(component.selectedGuideIndex).toEqual(1);
    });

    it('#selectGuide should update attributes when index is in range of guide array', () => {
        component.selectGuide(1);
        expect(component.selectedGuideIndex).toEqual(1);
        expect(component.hasNextGuide).toEqual(false);
        expect(component.hasPreviousGuide).toEqual(true);
    });

    it('#selectNextGuide should change the selectedGuide attribute if guide has a next and expand its menu', () => {
        component.sidebar = {
            expandAllMenus: () => {
                return;
            },
        } as GuideSidebarComponent;
        component.selectedGuideIndex = 0;
        component.hasNextGuide = true;

        spyOn(component, 'selectGuide');
        spyOn(component.sidebar, 'expandAllMenus');
        component.selectNextGuide();

        expect(component.sidebar.expandAllMenus).toHaveBeenCalled();
        expect(component.selectGuide).toHaveBeenCalledWith(1);
    });

    it('#selectPreviousGuide should change the selectedGuide attribute if guide has a previous and expand its menu', () => {
        component.sidebar = {
            expandAllMenus: () => {
                return;
            },
        } as GuideSidebarComponent;
        component.selectedGuideIndex = 1;
        component.hasPreviousGuide = true;

        spyOn(component, 'selectGuide');
        spyOn(component.sidebar, 'expandAllMenus');
        component.selectPreviousGuide();

        expect(component.sidebar.expandAllMenus).toHaveBeenCalled();
        expect(component.selectGuide).toHaveBeenCalledWith(0);
    });

    it('#selectPreviousGuide and #selectNextGuide should only expand all menus if there are no previous or next guides', () => {
        component.sidebar = {
            expandAllMenus: () => {
                return;
            },
        } as GuideSidebarComponent;
        component.hasPreviousGuide = false;
        component.hasNextGuide = false;

        spyOn(component, 'selectGuide');
        spyOn(component.sidebar, 'expandAllMenus');
        component.selectPreviousGuide();
        component.selectNextGuide();

        expect(component.selectGuide).not.toHaveBeenCalled();
        expect(component.sidebar.expandAllMenus).toHaveBeenCalledTimes(2);
    });
});
