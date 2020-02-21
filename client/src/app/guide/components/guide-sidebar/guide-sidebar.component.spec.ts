import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSidebarComponent } from './guide-sidebar.component';

enum MenuSection {
    Tools,
    ToolBrushes,
    ToolShapes,
    DrawingSurfaceOptions,
    FileOptions,
}

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
        component.toggleMenu(MenuSection.ToolShapes);
        expect(component.isEachMenuExpanded).toEqual([false, false, true, false, false]);
    });

    it('#toggleMenu should close menu on second toggle', () => {
        component.toggleMenu(MenuSection.ToolBrushes);
        component.toggleMenu(MenuSection.FileOptions);
        component.toggleMenu(MenuSection.ToolBrushes);
        expect(component.isEachMenuExpanded).toEqual([false, false, false, false, true]);
    });

    it('#expandAllMenus should open all menu', () => {
        component.expandAllMenus();
        expect(component.isEachMenuExpanded).toEqual([true, true, true, true, true]);
    });
});
