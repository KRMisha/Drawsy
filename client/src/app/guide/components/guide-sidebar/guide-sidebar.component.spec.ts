import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';

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
});
