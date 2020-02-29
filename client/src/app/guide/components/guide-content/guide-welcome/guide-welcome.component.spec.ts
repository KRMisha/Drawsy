import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideWelcomeComponent } from '@app/guide/components/guide-content/guide-welcome/guide-welcome.component';

describe('GuideWelcomeComponent', () => {
    let component: GuideWelcomeComponent;
    let fixture: ComponentFixture<GuideWelcomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideWelcomeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideWelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
