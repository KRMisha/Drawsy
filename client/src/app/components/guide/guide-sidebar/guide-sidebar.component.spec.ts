import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideSidebarComponent } from './guide-sidebar.component';

describe('GuideSidebarComponent', () => {
    let component: GuideSidebarComponent;
    let fixture: ComponentFixture<GuideSidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSidebarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#toggleMenu should activate the good menu', () => {
        // MenuSection.ToolShapes = 2
        component.toggleMenu(2);
        expect(component.isEachMenuExpanded).toEqual([false, false, true, false, false]);
    });

    it('#toggleMenu should close menu on second toggle', () => {
        component.toggleMenu(1);
        component.toggleMenu(4);
        component.toggleMenu(1);
        expect(component.isEachMenuExpanded).toEqual([false, false, false, false, true]);
    });

    it('#expandAllMenus should open all menu', () => {
        component.expandAllMenus();
        expect(component.isEachMenuExpanded).toEqual([true, true, true, true, true]);
    });
});
