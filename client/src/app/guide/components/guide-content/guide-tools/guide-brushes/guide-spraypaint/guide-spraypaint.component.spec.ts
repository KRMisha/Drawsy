import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSpraypaintComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spraypaint//guide-spraypaint.component';

describe('GuideSpraypaintComponent', () => {
    let component: GuideSpraypaintComponent;
    let fixture: ComponentFixture<GuideSpraypaintComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSpraypaintComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSpraypaintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
