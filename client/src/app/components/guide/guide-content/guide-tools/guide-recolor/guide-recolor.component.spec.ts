import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideRecolorComponent } from './guide-recolor.component';

describe('GuideRecolorComponent', () => {
    let component: GuideRecolorComponent;
    let fixture: ComponentFixture<GuideRecolorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideRecolorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideRecolorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
