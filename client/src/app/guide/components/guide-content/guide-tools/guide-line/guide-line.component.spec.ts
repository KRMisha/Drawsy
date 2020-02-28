import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideLineComponent } from '@app/guide/components/guide-content/guide-tools/guide-line/guide-line.component';

describe('GuideLineComponent', () => {
    let component: GuideLineComponent;
    let fixture: ComponentFixture<GuideLineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideLineComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
