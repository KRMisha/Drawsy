import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSelectionComponent } from '@app/guide/components/guide-content/guide-tools/guide-selection/guide-selection.component';

describe('GuideSelectionComponent', () => {
    let component: GuideSelectionComponent;
    let fixture: ComponentFixture<GuideSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSelectionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
