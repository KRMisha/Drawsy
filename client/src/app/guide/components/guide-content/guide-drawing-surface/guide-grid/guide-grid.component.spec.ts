import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';

describe('GuideGridComponent', () => {
    let component: GuideGridComponent;
    let fixture: ComponentFixture<GuideGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideGridComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
