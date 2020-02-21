import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideStampComponent } from './guide-stamp.component';

describe('GuideStampComponent', () => {
    let component: GuideStampComponent;
    let fixture: ComponentFixture<GuideStampComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideStampComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideStampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
