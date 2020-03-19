import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarColorPickerComponent } from '@app/editor/components/sidebar-color-picker/sidebar-color-picker.component';

describe('SidebarColorPickerComponent', () => {
    let component: SidebarColorPickerComponent;
    let fixture: ComponentFixture<SidebarColorPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarColorPickerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
