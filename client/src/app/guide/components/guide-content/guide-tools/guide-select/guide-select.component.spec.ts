import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSelectComponent } from '@app/guide/components/guide-content/guide-tools/guide-select/guide-select.component';

describe('GuideSelectComponent', () => {
    let component: GuideSelectComponent;
    let fixture: ComponentFixture<GuideSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSelectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
